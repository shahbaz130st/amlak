
export default class User {

    static instance = null;

    _userData = "";


    /**
     * @returns {User}
     */
    static getInstance() {
        if (User.instance == null) {
            User.instance = new User();
        }

        return this.instance;
    }

    getUser() {
        return this._userData;
    }

    setUser(user) {
        this._userData = user;
    }
}