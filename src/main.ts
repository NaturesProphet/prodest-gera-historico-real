import * as dotenv from 'dotenv';
if ( process.env.NODE_ENV != 'production' ) {
    dotenv.config();
}
import { ConnectionPool } from 'mssql';
import { Channel } from 'amqplib';
import { iniciaConexaoSql } from './services/mssql/iniciaConexao.service';
import { getConsumerChannel } from './services/rabbitmq/getConsumerChannel.service';
import * as rabbitConf from './common/rabbit.config';
import { recuperaViagem } from './services/mssql/recuperaViagem.service';
import { Historico } from './DTOs/Historico.interface';
import { salvaHistorico } from './services/mssql/salvaHistorico.service';
import { notifySlack } from './services/slack/notifications';
import { eliminaRedundancia } from 'services/utils/eliminaRedundancia.service';
import { preencheSequenciasVazias } from 'services/utils/preencheSequenciasVazias.service';



async function main () {

    let SqlConnection: ConnectionPool = await iniciaConexaoSql();
    const consumerChannel: Channel = await getConsumerChannel();

    console.log( '\n-----------------------------------------------------------' );
    console.log( `[ ${new Date().toString()} ]\nO Gerador de histórico real iniciou com sucesso!` );
    console.log( '-----------------------------------------------------------\n\n' );
    await consumerChannel.consume( rabbitConf.rabbitConsumerQueueName, async ( msg ) => {
        let infoVeiculo = JSON.parse( msg.content.toString() );
        let listaDeRegistros = await recuperaViagem( SqlConnection, infoVeiculo.viagem );


        if ( listaDeRegistros != undefined && listaDeRegistros.length > 0 ) {

            let historias: Historico[] = new Array();

            listaDeRegistros.forEach( historico => {
                let historia: Historico = {
                    datadecoleta: new Date(),
                    horarionoponto: historico.datahora,
                    itinerario_id: historico.itinerario_id,
                    ponto_id: historico.ponto_id,
                    pontofinal: historico.pontoFinal,
                    pontoinicial: historico.pontoInicial,
                    sequencia: historico.sequencia,
                    veiculo: historico.veiculo,
                    velocidade: historico.velocidade,
                    viagem_id: infoVeiculo.viagem
                }
                //ajusta pra hora local
                historia.datadecoleta.setUTCHours( historia.datadecoleta.getUTCHours() - 3 );
                historias.push( historia );
            } );
            historias = eliminaRedundancia( historias );
            historias = await preencheSequenciasVazias( SqlConnection, historias );


            historias.forEach( historia => {
                salvaHistorico( SqlConnection, historia );
            } );

        } else {
            let msg = `[ GERA-HISTORICO-REAL ] chegaram viagens finalizadas na fila que não foram `
                + `encontradas no banco. Verifique a sincronia dos dados.`
            notifySlack( msg, "Build" );
        }

        consumerChannel.ack( msg );
    } );
}

main();
