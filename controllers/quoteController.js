let quoteController = function (Quote) {

    //Post-functie
    let post = function (req, res) {

        let quote = new Quote(req.body);                          //Create a new mangoose-instance of book-model

        if (!req.body.quote) {                                  //Als titel niet bestaat in req.body

            res.status(400);
            res.send('Quote is required.');

        } else {                                                  //Als titel WEL bestaat in req.body
            quote._links.self.href = 'http://' + req.headers.host + '/api/quotes/' + quote._id
            quote._links.collection.href = 'http://' + req.headers.host + '/api/quotes/'

            quote.save();                                            //Saves Book made in Postman in mango-db
            res.status(201);                                        //Send status 201 means created
            res.send(quote);                                         //Sending book back so book-id is available to the client who called our API.                                                    
        }
    }

    //Get-Functie
    let get = function (req, res) {
        const perPage = 10
        const page = req.params.start || 1
        const start = parseInt(req.query.start)
        const limit = parseInt(req.query.limit)


        //Book is onze model, vind het en doe een callback.
        //Zoek ondertussen ook naar de query in dat boek;
        Quote.find({})

            .skip((perPage * page) - perPage)
            .limit(limit)

            .exec(function (err, quotes) {
                Quote.count().exec(function (err, count) {
                    if (err) return next(err)

                    let maxPage = Math.ceil(count / limit)

                    let paginate = {
                        items: quotes,

                        _links: { self: { href: 'http://' + req.headers.host + '/api/quotes' } },

                        pagination: {
                            currentPage: page,
                            currentItems: limit || count,
                            totalPages: maxPage,
                            totalItems: count,

                            _links: {
                                first: {
                                    page: 1,
                                    href: 'http://' + req.headers.host + '/api/quotes/?start=1$limit=' + limit
                                },
                                last: {
                                    page: maxPage,
                                    href: 'http://' + req.headers.host + '/api/quotes/?start=' + ((count - limit) + 1) + "&limit=" + limit
                                },
                                previous: {
                                    page: (page - 1),
                                    href: 'http://' + req.headers.host + '/api/quotes/?start=' + (start - limit) + "&limit=" + limit
                                },
                                next: {
                                    page: (page + 1),
                                    href: 'http://' + req.headers.host + '/api/quotes/?start=' + (start + limit) + "&limit=" + limit
                                }
                            }
                        }
                    }
                    res.json(paginate)
                })
            })

    }

    return {
        post: post,
        get: get
    }
}


module.exports = quoteController;

 