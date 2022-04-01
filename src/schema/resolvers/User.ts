import { User } from "../../entities";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const login = async (parent: any, args: any) => {
    const { email, password } = args;

    const result = await User.findOne({ where: { email } });

    if (result) {

        const matchPass = await bcrypt.compare(password, result.password);

        if (!matchPass) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ userId: result.id }, 'SECRET!');

        return {
            userId: result.id,
            token,
        }
    }

    throw new Error('User not found');

};

const getAllUsers = async (parent: any, args: any) => {
    return User.find();
};

const createUser = async (parent: any, args: any) => {
    const { email, username, password } = args;

    const hashPass = await bcrypt.hash(password, 10);

    const result = await User.insert({
        email,
        username,
        password: hashPass
    });

    console.log(result);

    return {
        id: result.identifiers[0].id,
        email,
        username,
    }
}

export {
    createUser,
    getAllUsers,
    login,
};