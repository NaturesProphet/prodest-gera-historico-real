import * as dotenv from 'dotenv';
if ( process.env.NODE_ENV != 'production' ) {
    dotenv.config();
}
import { ConnectionPool } from 'mssql';
import { Historico } from 'DTOs/Historico.interface';


export async function salvaHistorico ( pool: ConnectionPool, viagem: Historico ): Promise<any> {
    let horarionoPonto: string;
    let pinicial: string;
    let pfinal: string;
    let velocidade: string;
    let pontoId: string;


    if ( viagem.horarionoponto == null ) {
        horarionoPonto = "null";
    } else {
        horarionoPonto = `'${viagem.horarionoponto.toISOString()}'`;
    }

    if ( viagem.pontoinicial == null ) {
        pinicial = `null`;
        pfinal = pinicial;
    } else {
        if ( viagem.pontoinicial ) {
            pinicial = "'true'";
        } else {
            pinicial = "'false'";
        }
        if ( viagem.pontofinal ) {
            pfinal = "'true'";
        } else {
            pfinal = "'false'";
        }
    }

    if ( viagem.velocidade == null ) {
        velocidade = "null";
    } else {
        velocidade = `${viagem.velocidade}`;
    }

    if ( viagem.ponto_id == null ) {
        pontoId = "null";
    } else {
        pontoId = `${viagem.ponto_id}`;
    }

    let Query = `INSERT INTO historico_real (datadecoleta, horarionoponto, `
        + `pontofinal, pontoinicial, velocidade, veiculo, sequencia, `
        + `ponto_id, viagem_id, itinerario_id ) `
        + `VALUES ( '${viagem.datadecoleta.toISOString()}', ${horarionoPonto}, `
        + `${pfinal}, ${pinicial}, ${velocidade}, `
        + `'${viagem.veiculo}', ${viagem.sequencia}, ${pontoId}, `
        + ` ${viagem.viagem_id}, ${viagem.itinerario_id} ) `;

    try {
        await pool.request().query( Query );
    } catch ( err ) {
        let msg = `[ salvaHistorico ] Erro ao salvar histórico de viagem no banco estático\n`
            + `Erro: ${err.message}\n`
            + `Query: ${Query}`
        console.log( msg );
    }

}
