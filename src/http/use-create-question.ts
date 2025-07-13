import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateQuestionsRequest } from "./types/create-question-request";
import type { CreateQuestionsResponse } from "./types/create-question-response";
import type { GetRoomsQuestionsResponse } from "./types/get-rooms-questions-response";

export function useCreateQuestions(roomId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateQuestionsRequest) => {
			const response = await fetch(
				`http://localhost:3333/rooms/${roomId}/questions`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				},
			);

			const result: CreateQuestionsResponse = await response.json();

			return result;
		},

		onMutate({ questions }) {
			const question = queryClient.getQueryData<GetRoomsQuestionsResponse>([
				'get-questions',
				roomId,
			])

			const questionArray = question ?? []

			const newQuestions = {
				id: crypto.randomUUID(),
				questions,
				answer: null,
				createdAt: new Date().toDateString(),
				isGeneratingAnswer: true,
			}

			queryClient.setQueryData<GetRoomsQuestionsResponse>(
				['get-questions', roomId],
				[newQuestions, ...questionArray]
			)

			return { newQuestions, question }
		},

		onSuccess(data, _variables, context) {
			queryClient.setQueryData<GetRoomsQuestionsResponse>(
				['get-questions', roomId],
				question => {
					if (!question) {
						return question
					}
					if (!context.newQuestions) {
						return question
					}

					return question.map(question => {
						if (question.id === context.newQuestions.id) {
							return { ...context.newQuestions, id: data.questionId, answer: data.answer, isGeneratingAnswer: false }
						}

						return question
					})
				}
			)
		},

		onError(_error, _variables, context) {
			if (context?.question) {
				queryClient.setQueryData<GetRoomsQuestionsResponse>(
					['get-questions', roomId],
					context.question
				)

			}
		},

		/*
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["get-questions", roomId] });
		},*/
	});
}
