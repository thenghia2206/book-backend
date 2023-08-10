import jwt, { Secret } from 'jsonwebtoken';
import { Controller, Route, Tags, Post, Body, Get, Request, Security, Put, Query } from "tsoa";
import { IUserRegister, IUserLogin, IUserResponse, IRefreshTokenReq, IUserDB, IAccessTokenReq, IUser, IUserProfile, IUserUpdateProfile, IUserUpdatePassword, ILogout } from "./user.types";
import { failedResponse, instanceOfFailedResponseType, successResponse } from "../../utils/http";
import User from './user.model';
import { ActiveStatus } from '../../helper/common';
import { registerMail_HTML } from '../../mailService/registerMail_HTML';
import { sendMail } from '../../mailService/sendMail';
import { warnmingLogin } from '../../mailService/warningLogin_HTML';
import * as emailValidator from 'email-validator'
import { v4 as uuidv4 } from 'uuid';

@Route('users')
@Tags('Users')
export class UserController extends Controller {


    @Post('register')
    public async register(@Body() input: IUserRegister): Promise<any> {
        try {
            const { email, password, confirmPassword, name, phone, address, dob, gender } = input;
            if(!emailValidator.validate(email)){
                this.setStatus(400)
                return failedResponse("Email không đúng định dạng","Bad Request")
            }
            if (password !== confirmPassword) {
                this.setStatus(400);
                return failedResponse('Xác nhận mật khẩu không trùng khớp', 'NotEqualConfirm');
            }
            const user = await User.findOne({ email });
            if(user && user.active == 0){
                await User.findOneAndDelete({email})
            }else if (user) {
                this.setStatus(400);
                return failedResponse('Email này đã được đăng kí', 'UniqueEmail');
            }

            
            const newUser = new User({ email, password, name, address, phone, dob, gender, createdAt: new Date(), updatedAt: new Date(), role: 'user', active: ActiveStatus.InActive });
            await newUser.save();
            
            const mailOptions = {
                to: email,
                subject: "Kích hoạt tài khoản",
                text: '',
                html: registerMail_HTML(
                    name,
                    "Chào mừng bạn đến với Book Management ! Xác nhận email để bắt đầu",
                    `${process.env.CLIENT_DOMAIN}/active-account?email=${email}&activeCode=${newUser.activeCode}`
                )
            }
            sendMail(
                mailOptions.to,
                mailOptions.subject,
                mailOptions.text,
                mailOptions.html
            );
            const result = {
                email: newUser.email,
                name: newUser.name,
                message: 'Đăng kí tài khoản thành công! Vui lòng kiểm tra email để kích hoạt tài khoản'
            }

            return successResponse(result);

        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    // login 
    @Post('login')
    public async login(@Body() data: IUserLogin,@Request() request:any): Promise<any> {
        try {
            const { email, password, remember} = data;
            const device = request.headers['user-agent']
            const key = request.headers['key']
            const user = await User.checkLogin(email, password);
            if (instanceOfFailedResponseType<string>(user)) {
                this.setStatus(400);
                return failedResponse(user, 'FailedLogin');
            }
            user as IUserDB;
            if (!user) {
                this.setStatus(400);
                return failedResponse('Email hoặc mật khẩu không đúng', 'WrongEmailOrPassword');
            }

            if (user.active === ActiveStatus.InActive) {
                this.setStatus(400);
                return failedResponse('Tài khoản chưa được kích hoạt', 'AccountNotActivated');
            }
            
            let listDevice = []
            listDevice = user.device
            let listKey = []
            listKey = user.key
            if(key !="null"){
                if(!listKey.includes(key) && listKey.length > 0){
                    console.log(1)
                    listKey.push(key)
                    user.key = listKey
                    await user.save()
                    const mailOptions = {
                        to: user.email,
                        subject: "Cảnh báo đăng nhập",
                        text: '',
                        html: warnmingLogin(
                            user.name,
                        )
                    }
                    await sendMail(
                        mailOptions.to,
                        mailOptions.subject,
                        mailOptions.text,
                        mailOptions.html
                    );
                    if (user.role === 'user') {
                        const accessToken = jwt.sign({ id: user.id , email: user.email, scopes: ['user'] }, 'dqPyPxJnDS4e2iU0815m' as Secret, { expiresIn: '1d' }) + "." +String(key);
                        const refreshToken = jwt.sign({id: user.id, email: user.email, scopes: ['user']  }, 'DQpYpXjNds4E2Iu0815M' as Secret, { expiresIn: '7d' });
                        return successResponse({ accessToken, refreshToken, role: user.role });
                    }
                    if (user.role === 'admin') {
                        const accessToken = jwt.sign({id: user.id, email: user.email, scopes: ['admin', 'user'] }, 'dqPyPxJnDS4e2iU0815m' as Secret, { expiresIn: '1d' })+ "." +String(key);
                        const refreshToken = jwt.sign({id: user.id, email: user.email, scopes: ['admin', 'user'] }, 'DQpYpXjNds4E2Iu0815M' as Secret, { expiresIn: '7d' });
                        return successResponse({ accessToken, refreshToken, role: user.role });
                    }
                }else if(listKey.includes(key)){
                    console.log(2)
                    if (user.role === 'user') {
                        const accessToken = jwt.sign({ id: user.id , email: user.email, scopes: ['user'] }, 'dqPyPxJnDS4e2iU0815m' as Secret, { expiresIn: '1d' }) + "." +String(key);
                        const refreshToken = jwt.sign({id: user.id, email: user.email, scopes: ['user']  }, 'DQpYpXjNds4E2Iu0815M' as Secret, { expiresIn: '7d' });
                        return successResponse({ accessToken, refreshToken, role: user.role });
                    }
                    if (user.role === 'admin') {
                        const accessToken = jwt.sign({id: user.id, email: user.email, scopes: ['admin', 'user'] }, 'dqPyPxJnDS4e2iU0815m' as Secret, { expiresIn: '1d' })+ "." +String(key);
                        const refreshToken = jwt.sign({id: user.id, email: user.email, scopes: ['admin', 'user'] }, 'DQpYpXjNds4E2Iu0815M' as Secret, { expiresIn: '7d' });
                        return successResponse({ accessToken, refreshToken, role: user.role });
                    }
                }
            }else{
                console.log(3)
                if(listKey.length > 0){
                    const mailOptions = {
                        to: user.email,
                        subject: "Cảnh báo đăng nhập",
                        text: '',
                        html: warnmingLogin(
                            user.name,
                        )
                    }
                    await sendMail(
                        mailOptions.to,
                        mailOptions.subject,
                        mailOptions.text,
                        mailOptions.html
                    );
                }
                const uuid = uuidv4();
                listKey.push(uuid)
                user.key = listKey
                await user.save()
                if (user.role === 'user') {
                    const accessToken = jwt.sign({ id: user.id , email: user.email, scopes: ['user'] }, 'dqPyPxJnDS4e2iU0815m' as Secret, { expiresIn: '1d' }) + "." +String(uuid);
                    const refreshToken = jwt.sign({id: user.id, email: user.email, scopes: ['user']  }, 'DQpYpXjNds4E2Iu0815M' as Secret, { expiresIn: '7d' });
                    return successResponse({ accessToken, refreshToken, role: user.role });
                }
                if (user.role === 'admin') {
                    const accessToken = jwt.sign({id: user.id, email: user.email, scopes: ['admin', 'user'] }, 'dqPyPxJnDS4e2iU0815m' as Secret, { expiresIn: '1d' })+ "." +String(uuid);
                    const refreshToken = jwt.sign({id: user.id, email: user.email, scopes: ['admin', 'user'] }, 'DQpYpXjNds4E2Iu0815M' as Secret, { expiresIn: '7d' });
                    return successResponse({ accessToken, refreshToken, role: user.role });
                }
            }
            // let check = 0
            // if(!listDevice.includes(device) && listDevice.length > 1){
            //     const mailOptions = {
            //         to: user.email,
            //         subject: "Cảnh báo đăng nhập",
            //         text: '',
            //         html: warnmingLogin(
            //             user.name,
            //         )
            //     }
            //     await sendMail(
            //         mailOptions.to,
            //         mailOptions.subject,
            //         mailOptions.text,
            //         mailOptions.html
            //     );
            //     check = 1
            // }else if(listDevice.length  == 0){
            //     check = 1
            // }
            // if(check){
            let res = []
            const userOld = await User.findOne({email})
            res = userOld.device
            res.push(device)
            await userOld.save() 
            // }
            // if (user.role === 'user') {
            //     const accessToken = jwt.sign({ id: user.id , email: user.email, scopes: ['user'] }, 'dqPyPxJnDS4e2iU0815m' as Secret, { expiresIn: '1d' }) + ".ngothenghia";
            //     const refreshToken = jwt.sign({id: user.id, email: user.email, scopes: ['user']  }, 'DQpYpXjNds4E2Iu0815M' as Secret, { expiresIn: '7d' });
            //     return successResponse({ accessToken, refreshToken, role: user.role });
            // }
            // if (user.role === 'admin') {
            //     const accessToken = jwt.sign({id: user.id, email: user.email, scopes: ['admin', 'user'] }, 'dqPyPxJnDS4e2iU0815m' as Secret, { expiresIn: '1d' })+ ".ngothenghia";
            //     const refreshToken = jwt.sign({id: user.id, email: user.email, scopes: ['admin', 'user'] }, 'DQpYpXjNds4E2Iu0815M' as Secret, { expiresIn: '7d' });
            //     return successResponse({ accessToken, refreshToken, role: user.role });
            // }
            
        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    /**
     *  Active Account
     * @param email 
     * @param activeCode 
     * @returns 
     */
    @Get('/active-account')
    public async activateAccount(@Query() email: string, @Query() activeCode: string): Promise<any>{
        try {
            const filter = { email, activeCode };
            const updateData = { active: ActiveStatus.Active };
    
            const user = await User.findOne(filter);
    
            if (!user) {
                this.setStatus(200);
                return failedResponse('Không tìm thấy tài khoản', 'UserNotFound');
            }
    
            if (user.active === ActiveStatus.Active) {
                this.setStatus(200)
                return failedResponse('Tài khoản đã được kích hoạt', 'AccountActivated');
            }
            await user.updateOne(updateData);
    
            return successResponse('Kích hoạt tài khoản thành công');
        } catch (err) {
            this.setStatus(500);
            return failedResponse(`Caught error ${err}`, 'ServiceException');
        }
    }


    // refresh token
    @Post('refreshtoken')
    public async refreshToken(@Body() data: IRefreshTokenReq): Promise<any> {
        try {
            const { refreshToken } = data;
            if (!refreshToken) {
                this.setStatus(400);
                return failedResponse('Refresh token không tồn tại', 'RefreshTokenNotFound');
            }
            console.log(refreshToken);
            jwt.verify(refreshToken, 'DQpYpXjNds4E2Iu0815M' as Secret, async(err, user: any) => {
                if (err) {
                    this.setStatus(400);
                    return failedResponse('Refresh token không hợp lệ', 'RefreshTokenInvalid');
                }

                const accessToken = jwt.sign({ email: user.email }, 'dqPyPxJnDS4e2iU0815m' as Secret, { expiresIn: '1d' });
                const refreshToken = jwt.sign({ email: user.email }, 'DQpYpXjNds4E2Iu0815M' as Secret, { expiresIn: '7d' });
                return successResponse({ accessToken, refreshToken });
            })
        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    // get user info
    @Post('getuserinfo')
    public async getUserInfo(@Body() data: IAccessTokenReq) : Promise<IUserProfile | any>{
        try {
            const { accessToken } = data;

            if(!accessToken){
                this.setStatus(400);
                return failedResponse('Access token không tồn tại', 'AccessTokenNotFound');
            }
            const userInfo = await User.getUserProfile(accessToken);
            if(instanceOfFailedResponseType<IUser>(userInfo)){
                this.setStatus(400);
                return userInfo;
            }
            userInfo as IUserProfile;
            const result = {
                email: userInfo.email,
                name: userInfo.name,
                address: userInfo.address,
                positionId: userInfo.positionId,
                facilityId: userInfo.facilityId,
                createdAt: userInfo.createdAt,
                updatedAt: userInfo.updatedAt,
                role : userInfo.role
            }
            return successResponse(result);
            
        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    //get profile user by token in header
    @Security('jwt', ['user'])
    @Get('profile')
    public async getProfile(@Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getUserProfile(token);
            if(instanceOfFailedResponseType<IUser>(userInfo)){
                this.setStatus(400);
                return userInfo;
            }
            userInfo as IUserProfile;
            
            const result = {
                email: userInfo.email,
                name: userInfo.name,
                phone: userInfo.phone,
                address: userInfo.address,
                dob: userInfo.dob,
                gender: userInfo.gender,
                createdAt: userInfo.createdAt,
                updatedAt: userInfo.updatedAt
            }
            return successResponse(result);
        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    @Security('jwt', ['user'])
    @Put('profile')
    public async updateProfile(@Request() request: any, @Body() data: IUserUpdateProfile): Promise<any> {

        try {    
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getUserProfile(token);
            if(instanceOfFailedResponseType<IUser>(userInfo)){
                this.setStatus(400);
                return userInfo;
            }
            userInfo as IUser;
            const { name, phone, address } = data;
            const user = await User.findOne({
                email: userInfo.email
            });
            
            if(!user){
                this.setStatus(400);
                return failedResponse('User không tồn tại', 'UserNotExist');
            }
            console.log(user);
            if(!name || !phone || !address){
                this.setStatus(400);
                return failedResponse('Các trường không được để trống', 'FieldEmpty');
            }
           
            user.name = name;
            user.phone = phone;
            user.address = address;
            user.updatedAt = new Date()
            user.save()
            return successResponse(user);
        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    //change password
    @Security('jwt', ["user"])
    @Put('changepassword')
    public async changePassword(@Request() request: any, @Body() data: IUserUpdatePassword): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getUserProfile(token);
            if(instanceOfFailedResponseType<IUser>(userInfo)){
                this.setStatus(400);
                return userInfo;
            }
            userInfo as IUser;
            const { oldPassword, newPassword, confirmPassword } = data;
            const user = await User.findOne({
                email: userInfo.email
            });

            if(!user){
                this.setStatus(400);
                return failedResponse('User không tồn tại', 'UserNotExist');
            }
            if(!oldPassword || !newPassword){
                this.setStatus(400);
                return failedResponse('Các trường không được để trống', 'FieldEmpty');
            }
            if (newPassword != confirmPassword){
                this.setStatus(400);
                return failedResponse('Mật khẩu mới không khớp', 'PasswordNotMatch');   
            }
            user.password = newPassword;
            user.updatedAt = new Date()
            user.save();
            return successResponse(user);
        }
        catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }


    //check email exist
    /**
     * check email exist
     * @param email
     * @returns {Promise<any>}
     * @memberof UserController
     * @description check email exist
     */
    @Get('checkemail')
    public async checkEmail(@Query() email: string): Promise<any> {
        try {
            const user = await User.findOne({
                email: email
            });
            if(!user){
                return successResponse({
                    exist: false,
                    message: 'Email không tồn tại'
                });
            }
            return successResponse({
                exist: true,
                message: 'Email đã tồn tại'
            });
        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

}


