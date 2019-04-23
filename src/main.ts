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



async function main () {

    let SqlConnection: ConnectionPool = await iniciaConexaoSql();
    const consumerChannel: Channel = await getConsumerChannel();
    const publishChannel: Channel = await getPublishChannel();

    await consumerChannel.consume( rabbitConf.rabbitConsumerQueueName, async ( msg ) => {

    } );
}

main();
