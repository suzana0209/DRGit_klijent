import {ErrorCodeMap} from './error-code-map';
import {ErrorCode} from './error-code';

export const handleError = (errorCode: string, ...errorMaps: ErrorCodeMap[]) => {
	let errorValue = ErrorCode.UNKNOWN_ERROR;
	errorMaps.forEach(errorMap => {
		if (errorMap[errorCode] !== null) {
			errorValue = errorMap[errorCode];
		}
	});

	return errorValue;
};