import { Historico } from "../../DTOs/Historico.interface";

export function eliminaRedundancia ( historias: Historico[] ): Historico[] {

    if ( historias.length > 1 ) {

        let sequenciaAnterior: number = -1;
        let historiasSemRedundancia: Historico[] = new Array();

        for ( let index = 0; index < historias.length; index++ ) {
            if ( historias[ index ].sequencia != sequenciaAnterior ) {
                historiasSemRedundancia.push( historias[ index ] );
            }
            sequenciaAnterior = historias[ index ].sequencia;
        }

        return historiasSemRedundancia;

    } else return historias;
}
