module.exports = test =>{

    test(`
        {
        42;
        "grok";
        }
        `,{
        type:'Program',
        body:[
            {
                type: 'BlockStatement',
                body:[
                    {
                        type: 'ExpressionStatement',
                        expression:{
                            type:'NumericLiteral',
                            value:42
                        }
                    },
                    {
                        type: 'ExpressionStatement',
                        expression:{
                            type:'StringLiteral',
                            value:'grok'
                        }
                    }
                ]
            }
        ]
    })


    //nested block test
    test(`
        {
        42;
            {
                "grok";
            }
        }
        `,{
        type:'Program',
        body:[
            {
                type: 'BlockStatement',
                body:[
                    {
                        type: 'ExpressionStatement',
                        expression:{
                            type:'NumericLiteral',
                            value:42
                        }
                    },
                    {
                        type:'BlockStatement',
                        body:[
                            {
                                type: 'ExpressionStatement',
                                expression:{
                                    type:'StringLiteral',
                                    value:'grok'
                                }
                            }
                        ]
                    }
                    
                ]
            }
        ]
    })

    
}