module.exports = ({file, options, env}) => ({
    plugins: {
        'postcss-preset-env': options.presetEnv,
        'autoprefixer': options.autoprefixer,
        'cssnano': options.cssnano
    }
})
