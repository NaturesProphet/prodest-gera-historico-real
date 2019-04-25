import * as dotenv from 'dotenv';
if ( process.env.NODE_ENV != 'production' ) {
    dotenv.config();
}
import { ConnectionPool } from 'mssql';
import { Channel } from 'amqplib';
import { iniciaConexaoSql } from './services/mssql/iniciaConexao.service';
import { getConsumerChannel } from './services/rabbitmq/getConsumerChannel.service';
//import { getPublishChannel } from './services/rabbitmq/getPublishChannel.service';
import * as rabbitConf from './common/rabbit.config';
import { recuperaViagem } from './services/mssql/recuperaViagem.service';
import { Historico } from './DTOs/Historico.interface';
import { salvaHistorico } from './services/mssql/salvaHistorico.service';



async function main () {

    let SqlConnection: ConnectionPool = await iniciaConexaoSql();
    const consumerChannel: Channel = await getConsumerChannel();
    //const publishChannel: Channel = await getPublishChannel(); //saida pro rabbit desativada

    console.log( '\n-----------------------------------------------------------' );
    console.log( `[ ${new Date().toString()} ]\nO Gerador de histórico real iniciou com sucesso!` );
    console.log( '-----------------------------------------------------------\n\n' );
    await consumerChannel.consume( rabbitConf.rabbitConsumerQueueName, async ( msg ) => {
        let infoVeiculo = JSON.parse( msg.content.toString() );
        let listaDeRegistros = await recuperaViagem( SqlConnection, infoVeiculo.viagem );
        //let HistoricoReal = new Array();   //saida pro rabbit desativada



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
            historia.datadecoleta.setUTCHours( historia.datadecoleta.getUTCHours() - 3 )
            salvaHistorico( SqlConnection, historia ); //sem await pra ir mais rapido

            //HistoricoReal.push( historia ); //saida pro rabbit desativada
        } );




        //saida pro rabbit desativada

        // publishChannel.publish(
        //     rabbitConf.rabbitTopicName,
        //     rabbitConf.rabbitPublishRoutingKey,
        //     new Buffer( JSON.stringify( {
        //         historicoReal: HistoricoReal
        //     } ) ),
        //     { persistent: false }
        // );


        consumerChannel.ack( msg );
    } );
}

main();
