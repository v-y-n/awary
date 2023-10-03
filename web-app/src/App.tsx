import React, {useState} from 'react';
import './App.css';
import {Api, useApi} from './api';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/login';
import SignupPage from './pages/Signup';
import Projects from './pages/projects';
import {ModalServiceProvider, useModal} from './services/ModalService';
import ProjectPage from './pages/projectPage';
import HeaderBar from './components/HeaderBar';
import ProjectLogsPage from './pages/ProjectLogs';
import {ProjectApiKeysPage} from './pages/ProjectApiKeys';
import {RequireAuth} from './components/RequireAuth';
import ProjectPageBase from './components/ProjectPageBase';

function App() {
  	console.log(`App started on env '${process.env.NODE_ENV}'`)
	console.log(`API url is ${process.env.REACT_APP_API_URL}`)
	return (
			<div className="App bg-neutral-700 text-white h-screen overflow-hidden f-c scroll-smooth">
					<BrowserRouter>
						<Api>
							<ModalServiceProvider>
								<div className="w-full h-full">
									<Routes>
										<Route path="/signup" element={<SignupPage/>}/>
										<Route path="/" element={<LoginPage/>}/>
										<Route path="/projects" element={
											<RequireAuth>
												<Projects/>
											</RequireAuth>	
										}/>
										<Route path="/projects/:projectId/*" element={
											<ProjectPageBase/>
										}/>
									</Routes>
								</div>
							</ModalServiceProvider>
						</Api>
					</BrowserRouter>
			</div>
	);
}

export default App;
