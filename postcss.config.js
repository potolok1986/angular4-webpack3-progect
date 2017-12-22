/**
 * Created by Александр on 22.12.2017.
 */
module.exports = {
    plugins: [
        require('autoprefixer')({
            browsers: [
                'last 2 versions'
            ],
            cascade: true
        })
    ]
};