import * as dotenv from 'dotenv';
if ( process.env.NODE_ENV != 'production' ) {
    dotenv.config();
}
import { ConnectionPool } from 'mssql';


export async function recuperaViagem ( pool: ConnectionPool, viagemId: number ): Promise<any> {

    try {
        let Query = `SELECT datahora, pontoFinal, pontoInicial, velocidade, `
            + `veiculo, sequencia, ponto_id,itinerario_id `
            + `FROM veiculo_ponto_viagem_historico_bruto `
            + `WHERE viagem_id = ${viagemId} ORDER BY datahora`;

        let result = await pool.request().query( Query );
        if ( result.recordset.length > 0 ) {
            return result.recordset;
        } else {
            console.log( `[ recuperaViagem ] O Select nao achou nada!.\nSelect:${Query}\nResult:${result}` )
        }
    } catch ( err ) {
        let msg = `[ recuperaViagem ] Erro ao consultar viagens no banco estático\n${err.message} `;
        console.log( msg );
    }
}
