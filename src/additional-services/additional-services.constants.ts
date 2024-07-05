import { ExtensionForwardRuleType, FwType } from "./interfaces/additional-services.enum";

export const EXTENSION_NOT_FOUND = 'Добавочный отсутствует на АТС';
export const FWPROFILE_NOT_FOUND = 'Ошибка поиска профиля переадресации';
export const FORWARD_TYPE_ERROR = 'Ошибка профиля переадресации';


export const FORWARD_TYPE_RULE_TO_FW_TYPE: { [status in ExtensionForwardRuleType]: FwType } = {
    [ExtensionForwardRuleType.mobile]: FwType.Mobile,
    [ExtensionForwardRuleType.extension]: FwType.Extension,
    [ExtensionForwardRuleType.external]: FwType.External,
}
