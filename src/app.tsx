import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateRoom } from "./pages/create-room";
import { Room } from "./pages/room";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { RecordRoomsAudio } from "./pages/record-rooms-audio";

const queryClient = new QueryClient();

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route element={<CreateRoom />} index />
					<Route element={<Room />} path="/room/:roomId"/>
					<Route element={<RecordRoomsAudio />} path="/room/:roomId/audio" />
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	);
}
