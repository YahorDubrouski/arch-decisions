export {
    type ProjectContext,
    projectContextSchema,
    validateStep,
    isStepValid,
    isContextComplete,
} from './contextSchema';

import {isContextComplete, type ProjectContext} from './contextSchema';

export function validateContext(context: Partial<ProjectContext>): boolean {
    return isContextComplete(context);
}
