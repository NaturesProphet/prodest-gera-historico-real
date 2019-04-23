import * as dotenv from 'dotenv';
if ( process.env.NODE_ENV != 'production' ) {
    dotenv.config();
}
import { ConnectionPool } from 'mssql';
import { Channel } from 'amqplib';
import { iniciaConexaoSql } from './services/mssql/iniciaConexao.service';
import { getConsumerChannel } from './services/rabbitmq/getConsumerChannel.service';
import { getPublishChannel } from './services/rabbitmq/getPublishChannel.service';
import * as rabbitConf from './common/rabbit.config';
import { recuperaViagem } from 'services/mssql/recuperaViagem.service';
import { Historico } from 'DTOs/Historico.interface';



async function main () {

    let SqlConnection: ConnectionPool = await iniciaConexaoSql();
    const consumerChannel: Channel = await getConsumerChannel();
    const publishChannel: Channel = await getPublishChannel();

    await consumerChannel.consume( rabbitConf.rabbitConsumerQueueName, async ( msg ) => {
        let infoVeiculo = JSON.parse( msg.content.toString() );

        let listaDeRegistros = await recuperaViagem( SqlConnection, infoVeiculo.viagem );
        let HistoricoReal = new Array();
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
            HistoricoReal.push( historia );
            publishChannel.publish(
                rabbitConf.rabbitTopicName,
                rabbitConf.rabbitPublishRoutingKey,
                new Buffer( JSON.stringify( HistoricoReal ) ),
                { persistent: false }
            );
        } );
        consumerChannel.ack( msg );
    } );
}

main();
