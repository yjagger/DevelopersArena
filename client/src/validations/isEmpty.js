const isEmpty = (value) => ( value === null || value === undefined ||
    // eslint-disable-next-line 
    (typeof value === 'object' && Object.keys(value).length ==0 ) ||
    // eslint-disable-next-line
     (typeof value === 'string' && value.trim().length ==0));

export default isEmpty;