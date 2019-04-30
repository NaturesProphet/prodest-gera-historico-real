import { Historico } from "../../DTOs/Historico.interface";
import { getSequencias } from "services/mssql/getSequencias.service";
import { ConnectionPool } from "mssql";

export async function preencheSequenciasVazias
    ( sqlConnection: ConnectionPool, historias: Historico[] ): Promise<Historico[]> {

    let itinerarioId: number = historias[ 0 ].itinerario_id;
    let sequencias: number[] = await getSequencias( sqlConnection, itinerarioId );
    let historicoLinearizado: Historico[] = new Array();

    // cria um dicionario de historias usando a sequencia como chave
    let dicionarioHistorias = new Object();
    historias.forEach( element => {
        dicionarioHistorias[ element.sequencia ] = element;
    } );

    for ( let index = 0; index < sequencias.length; index++ ) {
        if ( dicionarioHistorias[ index + 1 ] != undefined ) {
            historicoLinearizado.push( historias[ index ] );
        } else {
            let historiaFake: Historico = {
                datadecoleta: historias[ 0 ].datadecoleta,
                horarionoponto: null,
                itinerario_id: historias[ 0 ].itinerario_id,
                ponto_id: null,
                pontofinal: null,
                pontoinicial: null,
                sequencia: index + 1,
                veiculo: historias[ 0 ].veiculo,
                velocidade: null,
                viagem_id: historias[ 0 ].viagem_id
            }
            historicoLinearizado.push( historiaFake );
        }
    }
    return historicoLinearizado;
}
