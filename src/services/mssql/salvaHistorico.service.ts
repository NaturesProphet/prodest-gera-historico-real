import * as dotenv from 'dotenv';
if ( process.env.NODE_ENV != 'production' ) {
    dotenv.config();
}
import { ConnectionPool } from 'mssql';
import { Historico } from 'DTOs/Historico.interface';


export async function salvaHistorico ( pool: ConnectionPool, viagem: Historico ): Promise<any> {
    let Query = `INSERT INTO historico_real (datadecoleta, horarionoponto, `
        + `pontofinal, pontoinicial, velocidade, veiculo, sequencia, `
        + `ponto_id, viagem_id, itinerario_id ) `
        + `VALUES ( '${viagem.datadecoleta.toISOString()}', '${viagem.horarionoponto.toISOString()}', `
        + `'${viagem.pontofinal}', '${viagem.pontoinicial}', ${viagem.velocidade}, `
        + `'${viagem.veiculo}', ${viagem.sequencia}, ${viagem.ponto_id}, `
        + ` ${viagem.viagem_id}, ${viagem.itinerario_id} ) `
    try {
        let result = await pool.request().query( Query );
    } catch ( err ) {
        let msg = `[ salvaHistorico ] Erro ao salvar histórico de viagem no banco estático\n`
            + `Erro: ${err.message}\n`
            + `Query: ${Query}`
        console.log( msg );
    }
}
