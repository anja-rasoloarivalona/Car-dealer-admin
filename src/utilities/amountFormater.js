export const amountFormater = (amount, prevCurrency, nextCurrency, quotes) => {
    let USDCAD = quotes.USDCAD
    let USDEUR = quotes.USDEUR
    let result;

    if(prevCurrency === 'CAD'){
        if(nextCurrency === 'USD'){
            result = amount / USDCAD
        }
        if(nextCurrency === 'EUR'){
            result = amount / USDCAD * USDEUR
        }
        if(nextCurrency === 'CAD'){
            result = amount 
        }
    }

    if(prevCurrency === 'USD'){
        if(nextCurrency === 'CAD'){
            result = amount * USDCAD
        }
        if(nextCurrency === 'EUR'){
            result = amount * USDEUR
        }
    }

    if(prevCurrency === 'EUR'){
        if(nextCurrency === 'USD'){
            result = amount / USDEUR
        }
        if(nextCurrency === 'CAD'){
            result = amount / USDEUR * USDCAD
        }
    }

    return result
}