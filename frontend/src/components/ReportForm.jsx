import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReport } from '../redux/reportSlice';

const ReportForm = () => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const dispatch = useDispatch();
	const { loading, error } = useSelector((state) => state.reports);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await dispatch(createReport({ title, description })).unwrap();
			alert('Reporte creado exitosamente');
		} catch (error) {
		console.error('Error al crear el reporte:', error);
		alert('Hubo un problema al crear el ticket: ${error}');
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>Title:</label>
				<input
				type='text'
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				required
				/>
			</div>
			<div>
				<label>Description:</label>
				<textarea
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				required
				/>
			</div>
			<button type='submit' disabled={loading}>
				{loading ? 'Submitting...' : 'Submit Report'}
			</button>
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</form>
	);
};

export default ReportForm;

