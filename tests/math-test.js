module.exports = test =>{

    //addition
    test(`2 + 2;`,{
        type:'Program',
        body:[
            {
                type: 'ExpressionStatement',
                expression:{
                    type:'BinaryExpression',
                    operator:'+',
                    left:{  
                            type:'NumericLiteral',
                            value:2 
                    },
                    right:{  
                            type:'NumericLiteral',
                            value:2 
                    },
                }
                
                
            }
        ]
    })


    //nested binary expressions
    //multiplcation takes higher precedence so Right from left
    test(`2 + 2 * 2;`,{
        type:'Program',
        body:[
            {
                type: 'ExpressionStatement',
                expression:{
                    type:'BinaryExpression',
                    operator:'+',
                    right:{
                        type: 'BinaryExpression',
                        operator: '*',
                        left:{
                            type:'NumericLiteral',
                            value:2 
                        },
                        right:{
                            type:'NumericLiteral',
                            value:2 
                        }
                    },
                    left:{  
                            type:'NumericLiteral',
                            value:2 
                    },
                }
                
                
            }
        ]
    })



    test(`3 + 2 - 2;`,{
        type:'Program',
        body:[
            {
                type: 'ExpressionStatement',
                expression:{
                    type:'BinaryExpression',
                    operator:'-',
                    left:{
                        type: 'BinaryExpression',
                        operator: '+',
                        left:{
                            type:'NumericLiteral',
                            value:3 
                        },
                        right:{
                            type:'NumericLiteral',
                            value:2 
                        }
                    },
                    right:{  
                            type:'NumericLiteral',
                            value:2 
                    },
                }
                
                
            }
        ]
    })

    test(`(2 + 2) * 2;`,{
        type:'Program',
        body:[
            {
                type: 'ExpressionStatement',
                expression:{
                    type:'BinaryExpression',
                    operator:'*',
                    left:{
                        type: 'BinaryExpression',
                        operator: '+',
                        left:{
                            type:'NumericLiteral',
                            value:2 
                        },
                        right:{
                            type:'NumericLiteral',
                            value:2 
                        }
                    },
                    right:{  
                            type:'NumericLiteral',
                            value:2 
                    },
                }
                
                
            }
        ]
    })
}



