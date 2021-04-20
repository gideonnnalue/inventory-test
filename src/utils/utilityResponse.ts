import { Response } from 'express';

type DataResponseType = {
	quantity: number;
	validTill: number;
};

type UtilityResponseType = {
	res: Response;
	data?: DataResponseType | null;
	message: string;
	statusCode: number;
};

const utilityResponse = ({
	res,
	data = null,
	message,
	statusCode,
}: UtilityResponseType): Response<unknown, Record<string, unknown>> =>
	res.status(statusCode).json({
		data,
		message,
		status: statusCode === 400 || statusCode === 500 ? 'ERROR' : 'SUCCESS',
	});

export default utilityResponse;
