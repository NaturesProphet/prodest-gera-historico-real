import * as dotenv from 'dotenv';
if ( process.env.NODE_ENV != 'production' ) {
    dotenv.config();
}
import { ConnectionPool } from 'mssql';


export async function salvaHistoria ( pool: ConnectionPool, dados ): Promise<any> {

    try {
        let insertQuery = ``;

        let result = await pool.request().query( insertQuery );
        if ( result.rowsAffected.length == 1 ) {
            return;
        } else {
            console.log( `[ salvaHistorico ] executou insert sem erros mas não gravou nada!. ${result}` )
        }
    } catch ( err ) {
        let msg = `[ salvaHistorico ] Erro ao consultar viagens no banco estático\n${err.message} `;
        console.log( msg );
    }
}
