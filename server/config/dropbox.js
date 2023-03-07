const { Dropbox } = require('dropbox');

const dbx = new Dropbox({
    accessToken:
        'sl.BZnYJHOwnLdHxs9TKjbxNeoNjVUVypIcUAY9qTc6EOt5JAdtUN8B34RhGGVPhGVzGjij6nRfZvZyewVbk-jycHv7on1D-iZ-k-AScwWBHJXU4AFJimavnLYWl0iHtHPxlISPuAmykAf1',
});

module.exports = dbx;
