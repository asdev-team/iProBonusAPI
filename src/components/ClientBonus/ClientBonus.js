import './ClientBonus.css'

import React, {useState, useEffect, Fragment} from "react";
import ContentLoader from 'react-content-loader'

import API from "@/components/Utils/API";
import {getTokenURL, getBonusInfo} from "@/components/Utils/Methods";
import {dateFormat, declination, proxyURL} from "@/components/Utils/functions";

const ClientBonus = ({ClientID, DeviceID}) => {
    const [bonusCard, setBonusCard] = useState({
        currentQuantity: '300 бонусов',
        burningDate: '29.03 сгорит',
        burningQuantity: '250 бонусов',
        loading: !(!ClientID || !DeviceID),
        loaded: false,
        error: !ClientID || !DeviceID,
        errorMessage: !ClientID || !DeviceID ? 'Не найдены обязательные параметры' : false
    })

    const [accessToken, setAccessToken] = useState(false)

    const setBonusCardError = (message) => {
        setBonusCard((prev) => {
            return {
                ...prev,
                loaded: false,
                loading: false,
                error: true,
                errorMessage: message,
            }
        })
    }

    const getAccessToken = () => {
        if (!accessToken) {
            const postData = {
                "idClient": ClientID,
                "accessToken": "",
                "paramName": "device",
                "paramValue": DeviceID,
                "latitude": 0,
                "longitude": 0,
                "sourceQuery": 0
            };
            API.post(proxyURL(getTokenURL), postData)
                .then((res) => {
                    // console.log("ACCESS TOKEN RECEIVED: ", res);
                    if (res.status === 200 && res.data.accessToken) {
                        setAccessToken(() => {
                            return res.data.accessToken
                        })
                    } else {
                        setBonusCardError('Не удалось получить токен')
                    }

                })
                .catch((err) => {
                    setBonusCardError('Не удалось получить токен')
                    console.log("AXIOS ERROR: ", err);
                })
        }
    }
    const getBonusCard = () => {
        if (accessToken && !bonusCard.loaded) {
            API.get(proxyURL(getBonusInfo + accessToken))
                .then((res) => {
                    // console.log("BONUS INFO RECEIVED: ", res);
                    if (res.status === 200 && res.data.data) {
                        setBonusCard((prev) => {
                            return {
                                ...prev,
                                currentQuantity: declination(res.data.data.currentQuantity, ['бонус', 'бонуса', 'бонусов']),
                                burningDate: dateFormat('%d-%m', new Date(res.data.data.dateBurning)) + ' сгорает',
                                burningQuantity: declination(res.data.data.forBurningQuantity, ['бонус', 'бонуса', 'бонусов']),
                                loading: false,
                                loaded: true,
                                error: false,
                                errorMessage: false
                            }
                        })
                    } else {
                        setBonusCardError('Бонусы не найдены')
                    }

                })
                .catch((err) => {
                    setBonusCardError('Не удалось получить данные')
                    console.log("AXIOS ERROR: ", err);
                })
        }
    }

    useEffect(() => {
        if (!bonusCard.error) {
            getAccessToken()
            getBonusCard()
        }
    })

    const ClientBonusCardLoading = () => {
        return (
            <Fragment>
                <ContentLoader
                    speed={1}
                    backgroundColor={'#CBCBCB'}
                    foregroundColor={'#dedede'}
                    viewBox="0 0 311 68"
                >
                    <rect x="0.819321" y="44" width="97" height="24"/>
                    <rect x="102.319" y="44" width="97" height="24"/>
                    <rect x="0.819321" width="150" height="32"/>
                </ContentLoader>
            </Fragment>
        )
    }
    const ClientBonusCard = () => {
        return (
            <Fragment>
                <div className="clientBonusCard--Stats">
                    <div className="clientBonusCard--current--quantity">{bonusCard.currentQuantity}</div>
                    <div className="clientBonusCard--burning">
                        <div className="clientBonusCard--burning--date">{bonusCard.burningDate}</div>
                        <div className="clientBonusCard--burning--icon">
                            <svg width="13" height="17" viewBox="0 0 13 17" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M3.6533 11.4134C2.46742 9.43863 3.13318 5.24933 5.83783 3.80468C6.55744 3.52587 7.14003 2.97078 7.45967 2.25937C7.7793 1.54796 7.81029 0.737409 7.54592 0.00299072C7.54592 0.00299072 9.82304 1.54372 8.73182 5.10783C7.6406 8.67194 9.58585 9.24959 9.58585 9.24959C9.14308 8.67691 8.93882 7.951 9.01684 7.22731C9.07406 6.72254 9.23962 6.23667 9.50185 5.80388C9.76408 5.3711 10.1166 5.0019 10.5346 4.72239C9.72838 7.61169 13.001 9.05211 13.001 12.5001C13.001 15.948 9.3955 17.003 9.3955 17.003C9.39635 16.3675 9.25093 15.7405 8.97081 15.1721C8.69068 14.6037 8.28362 14.1096 7.78208 13.7293C6.07399 12.4768 6.64402 9.54002 6.64402 9.54002C4.4595 12.7662 5.55282 17.004 5.55282 17.004C5.55282 17.004 4.55626 15.608 3.60756 15.4633C2.65885 15.3186 2.13664 13.9701 2.13664 13.9701C2.15057 14.4998 2.29186 15.0181 2.54823 15.4797C2.8046 15.9413 3.16828 16.3323 3.60756 16.6186C-3.74597 13.1517 2.42166 7.99819 2.42166 7.99819C1.70909 10.7396 3.6533 11.4134 3.6533 11.4134Z"
                                    fill="url(#burning--icon--gradient)"/>
                                <defs>
                                    <linearGradient id="burning--icon--gradient" x1="6.99978" y1="6.00006"
                                                    x2="6.99978"
                                                    y2="17.0001" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#FFB258"/>
                                        <stop offset="1" stopColor="#C71515"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="clientBonusCard--burning--quantity">{bonusCard.burningQuantity}</div>
                    </div>
                </div>
                <button className="clientBonusCard--Button">
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="17.5" cy="17.5" r="17" stroke="#D4343F"/>
                        <path d="M15.7716 23.1948L21.2284 17.5" stroke="#D4343F" strokeLinecap="round"/>
                        <path d="M15.7716 11.8052L21.2284 17.5" stroke="#D4343F" strokeLinecap="round"/>
                    </svg>
                </button>
            </Fragment>
        )
    }
    const ClientBonusCardError = () => {
        return (
            <Fragment>
                <p className="clientBonusCard--error">{bonusCard.errorMessage}</p>
            </Fragment>
        )
    }

    return (
        <section className="clientBonusCardWrapper">
            <div className="clientBonusCard appContainer">
                {bonusCard.loading && !bonusCard.loaded && !bonusCard.error && <ClientBonusCardLoading/>}
                {!bonusCard.loading && bonusCard.loaded && !bonusCard.error && <ClientBonusCard/>}
                {!bonusCard.loading && !bonusCard.loaded && bonusCard.error && <ClientBonusCardError/>}
            </div>
        </section>
    )
}


export default ClientBonus