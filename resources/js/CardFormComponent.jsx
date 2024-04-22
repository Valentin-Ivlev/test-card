import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputMask from 'react-input-mask';
import 'bootstrap/dist/css/bootstrap.min.css';

const CardFormComponent = () => {
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [saveCard, setSaveCard] = useState(false);
    const [amountUSD, setAmountUSD] = useState('');
    const [amountRUB, setAmountRUB] = useState('');

    useEffect(() => {
        axios.get('/api/cards')
            .then(response => setCards(response.data))
            .catch(error => console.error('Ошибка при получении карт', error));
    }, []);

    const handleAmountChange = (value, currency) => {
        if (currency === 'USD') {
            setAmountUSD(value);
            setAmountRUB(value ? (value * 15).toFixed(2) : '');
        } else {
            setAmountRUB(value);
            setAmountUSD(value ? (value / 15).toFixed(2) : '');
        }
    };

    const handleCardSelection = (card) => {
        setSelectedCard(card);
        setCardNumber(card.card_number.replace(/\s/g, ''));
        setExpiryMonth(card.expiry_month);
        setExpiryYear(card.expiry_year);
        setCvv(card.cvv);
    };

    const handleNewCardSelection = () => {
        setSelectedCard(null);
        setCardNumber('');
        setExpiryMonth('');
        setExpiryYear('');
        setCvv('');
    };

    const validateCardDetails = () => {
        const errors = [];
        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
            errors.push('card_number');
        }

        const currentYear = new Date().getFullYear() % 100; // Получаем две последние цифры года
        const currentMonth = new Date().getMonth() + 1; // Месяц от 1 до 12

        if (!((expiryMonth >= 1 && expiryMonth <= 12 && expiryYear > currentYear) || (expiryYear == currentYear && expiryMonth >= currentMonth))) {
            errors.push('expiry_month');
        }
        if (!/^\d{2}$/.test(expiryMonth)) {
            errors.push('expiry_month');
        }
        if (expiryYear < currentYear) {
            errors.push('expiry_year');
        }
        if (!/^\d{2}$/.test(currentYear)) {
            errors.push('expiry_year');
        }
        if (!/^\d{3}$/.test(cvv)) {
            errors.push('cvv');
        }
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateCardDetails();
        if (validationErrors.length > 0) {
            alert("Проверьте введенные данные: " + validationErrors.join(", "));
            return;
        }
        const cardData = {
            card_number: cardNumber.replace(/\s/g, ''),
            expiry_month: expiryMonth,
            expiry_year: expiryYear,
            cvv: cvv,
            save: saveCard
        };
        axios.post('/api/cards', cardData)
            .then(response => {
                alert(response.data.message);
                if (saveCard) {
                    setCards([...cards, response.data.card]);
                }
            })
            .catch(error => {
                console.error('Ошибка сохранения карты', error);
                alert('Ошибка сохранения карты');
            });
    };

    return (
        <div className="container">
            <div
                className="col-xl-6 col-lg-8 col-md-10 col-sm-12 offset-xl-3 offset-lg-2 offset-md-1 offset-sm-0 rounded-3 shadow my-5 p-5">
                <h2>Пополнить банковской картой</h2>
                <div className="row">
                    <label htmlFor="amountUSD" className="form-label">Укажите сумму</label>
                </div>
                <div className="row">
                    <div className="col-7">
                        <div className="input-group">
                            <input type="number" className="form-control" id="amountUSD" placeholder="0.00"
                                   value={amountUSD}
                                   onChange={(e) => handleAmountChange(e.target.value, 'USD')}/>
                            <span className="input-group-text">ֆ</span>
                            <input type="number" className="form-control" id="amountRUB" placeholder="0.00"
                                   value={amountRUB}
                                   onChange={(e) => handleAmountChange(e.target.value, 'RUB')}/>
                            <span className="input-group-text">₽</span>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-12 mt-2">
                        {cards.map(card => (
                            <div key={card.id} className={`card-btn saved-card float-start me-2 mb-2 ${selectedCard && selectedCard.id === card.id ? 'border-primary border-2' : ''}`} onClick={() => handleCardSelection(card)}>
                                <div>**** {card.card_number.slice(-4)}</div>
                                <div>{card.expiry_month}/{card.expiry_year}</div>
                            </div>
                        ))}
                        <div className={`card-btn float-start mb-2 text-center ${selectedCard ? '' : 'border-primary border-2'}`} onClick={handleNewCardSelection}>
                            <div className="plus">+</div>Новая карта
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="card-container">
                                <div className="card-back">
                                    <span className="p-0 mb-1 font-085em">CVV/CVC</span>
                                    <InputMask mask="999"
                                               className={`form-control ${validateCardDetails().includes('cvv') ? 'is-invalid' : ''}`}
                                               id="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)}/>
                                    <div className="pt-1 font-065em">три цифры с обратной стороны карты</div>
                                </div>
                                <div className="card-front">
                                    <span className="p-0 mb-1 font-085em">НОМЕР КАРТЫ</span>
                                    <InputMask mask="9999 9999 9999 9999"
                                               className={`form-control m-0 ${validateCardDetails().includes('card_number') ? 'is-invalid' : ''}`}
                                               id="cardNumber" value={cardNumber}
                                               onChange={(e) => setCardNumber(e.target.value)}/>
                                    <div className="row">
                                        <span className="mt-2 mb-1 font-085em">ДЕЙСТВУЕТ ДО</span>
                                    </div>
                                    <div className="row">
                                        <div className="col-3 pe-0 me-0">
                                            <InputMask mask="99" placeholder="ММ"
                                                       className={`form-control ${validateCardDetails().includes('expiry_month') ? 'is-invalid' : ''}`}
                                                       id="expiryMonth" value={expiryMonth}
                                                       onChange={(e) => setExpiryMonth(e.target.value)}/>
                                        </div>
                                        <div className="col-1 pt-1 px-0 mx-0 text-center">/</div>
                                        <div className="col-3 ps-0 ms-0">
                                            <InputMask mask="99" placeholder="ГГ"
                                                       className={`form-control ${validateCardDetails().includes('expiry_year') ? 'is-invalid' : ''}`}
                                                       id="expiryYear" value={expiryYear}
                                                       onChange={(e) => setExpiryYear(e.target.value)}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-check mt-3">
                        <input type="checkbox" className="form-check-input" id="saveCard" checked={saveCard}
                               onChange={(e) => setSaveCard(e.target.checked)}/>
                        <label className="form-check-label" htmlFor="saveCard">
                            Запомнить карту. Это безопасно. &#9432;<br/>Сохраняя карту, вы соглашаетесь с <a
                            href="/#conditions">условиями привязки карты</a>.
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3 rounded-5">Оплатить</button>
                </form>
            </div>
        </div>
);
};

export default CardFormComponent;
