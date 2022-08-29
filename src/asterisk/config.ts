import { AsterismContext } from "./types/types";

export const LOCAL_ROUTING = 'RouteToLocalUser';
export const DEFAULT_ROUTING = 'RouteToDefaultIncomingRoute';

export const ContextDialplanNumberMap: { [context in AsterismContext]: string}  =  {
    'westcall-in': '78124542154',
    'kolchugino-in': '84924529300',
    'pyatigorsk-in': '8793317822',
    'kaliningrad-in': '605098',
    'chelyabinsk-in': '2420102',
    'krasnodar-mango-in': '78612050010',
    'krasnodar-mango-direct-in': '78612051601',
    'nizhniy-in': '78312601222',
    'nizhniy-yandex-in': '78312601672',
    'mango-samara-in': '78463004454',
    'mango-spb-in': '78126034776',
    'mango-voronezh-in': '74733003888',
    'mango-voronezh-direct-in': '74733003926',
    'mango-moscow-yandex-in': '74994900794',
    'mango-novnosibirsk-in':'73833885445',
    'mango-ufa-in':'73472000330',
};

// let idTrunk3CX = {
//     '10028': '78612050010',
//     '10004': '78612051601',
//     '10026': '78312601222',
//     '10003': '78312601672',
//     '10030': '78463004454',
//     '10027': '78126034776',
//     '10025': '74733003888',
//     '10005': '74733003926',
//     '10007': '78124542154',
//     '10029': '74994900794',
//     '10006': '78793317822',
//     '10024': '73512420102',
//     '10021': '74957755522',
// };
