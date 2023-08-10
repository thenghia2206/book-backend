export const warnmingLogin = (fullName : string) => {
    return `
    <!doctype html>
    <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css?family=Lato');
                * {
                    color: #000;
                    font-family: 'Lato', sans-serif;
                }
                #logo {
                    font-weight: bold;
                    font-size: 20px;
                    color: #000000;
                    margin: 20px auto;
                    display: block;
                }
                #logo-image {
                    width: 50px;
                  
                }
                #name-text {
                    color: #FF6600;
                }
    
              
    
                #header > p {
                    margin: 0;
                    line-height: 34px;
                }
    
                #wrapper-content {
                    width: 500px;
                    display: block;
                    margin: 0 auto;
                    text-align: center;
                }
    
                p {
                    font-size: 18px;
                    line-height: 28px;
                }
    
                .horizon {
                    width: 100%;
                    height: 2px;
                    background-color: lightgray;
                }
    
                #footer {
                    font-size: 14px;
                }
    
                #footer p {
                    color: lightgray;
                }
    
                #link-confirm {
                    cursor: pointer;
                    box-sizing: border-box;
                    padding: 12px 16px;
                    border-radius: 5px;
                    background-color: #CF0201;
                    border: none;
                    font-size: 18px;
                    color: #ffffff;
                    font-weight: 500;
                    margin: 12px auto;
                    outline: none;
                    width: 250px;
                    text-decoration: none;
                    text-align: center;
                }
    
                #pinme-team {
                    margin-top: 18px;
                }
    
                .small-text {
                    color: lightgrey;
                    font-size: 16px;
                }
            </style>
        </head>
        <body>
            <div id="wrapper-content">
                <p id="logo"> Book Management
                </p>
                
    
                <div id="header"><p>Cảnh báo <strong>${fullName}</strong>!</p></div>
    
                <div class="body">
                    <p>Chúng tôi phát hiện tài khoản của bạn đang được đăng nhập trên một thiết bị khác</p>
                </div>
    
                <div class="horizon"></div>
    
                <div id="footer">
                    <p>Send with &hearts;</p>
                </div>
            </div>
        </body>
    </html>
    `
}