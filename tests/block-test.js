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

    test(`'hello';`,{
        type:'Program',
        body:[
            {
                type: 'ExpressionStatement',
                expression:{
                    type:'StringLiteral',
                    value:'hello'
                }
            }
        ]
    })
}