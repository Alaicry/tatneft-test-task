import React from 'react';
import { useAppDispatch } from '../store';
import { fetchWeatherData } from '../store/slices/weatherSlice';
import Container from '../UI/Container';
import Header from '../UI/Header';

interface IErrorStateProps {
    error: string;
}

export const ErrorState: React.FC<IErrorStateProps> = ({ error }) => {
    const dispatch = useAppDispatch();

    return (
        <div className="app">
            <Container>
                <Header />
                <div className="error-state">
                    <div className="error-state__content">
                        <div className="error-state__message">Ошибка: {error}</div>
                        <button 
                            className="error-state__retry-button"
                            onClick={() => dispatch(fetchWeatherData())}
                        >
                            Повторить загрузку
                        </button>
                    </div>
                </div>
            </Container>
        </div>
    );
};