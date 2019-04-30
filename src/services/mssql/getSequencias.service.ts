import * as dotenv from 'dotenv';
if ( process.env.NODE_ENV != 'production' ) {
    dotenv.config();
}
import { ConnectionPool } from 'mssql';


export async function getSequencias ( pool: ConnectionPool, itinerarioId: number ): Promise<any> {

    try {
        let Query = `SELECT ordem FROM itinerario_ponto `
            + `WHERE itinerario_id = ${itinerarioId} ORDER BY ordem`;

        let result = await pool.request().query( Query );
        if ( result.recordset.length > 0 ) {
            let sequencias: number[] = new Array();
            result.recordset.forEach( element => {
                sequencias.push( element.ordem );
            } );
            return sequencias;
        } else {
            console.log( `[ getSequencias ] O Select nao achou nada!.\nSelect:${Query}\nResult:${result}` )
        }
    } catch ( err ) {
        let msg = `[ getSequencias ] Erro ao consultar sequências no banco estático\n${err.message} `;
        console.log( msg );
    }
}
