# grunt-levin-assets-mapping

> Generate the mapping of JSON file by dest static assets

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-levin-assets-mapping --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-levin-assets-mapping');
```

## The "levin_assets_mapping" task

### Overview
In your project's Gruntfile, add a section named `levin_assets_mapping` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  levin_assets_mapping: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.mapping
mapping: `String`
Default value: `{{dest}}mapping.json`

A result JSON file of mapping name

#### options.algorithm
algorithm: `String`
Default value: `md5`

A string value that is used to change file name.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  levin_assets_mapping: {
        options:{
          mapping:'{{= dest}}md5conf.json',
          algorithm:'md5'
        },
        asset:{
            files:[
              {
                  cwd:'test/module1/',
                  src:['**/*.js','**/*.css','**/*.htm','**/*.{jpg,jpeg,gif,png}'],
                  dest:'tmp/module1/'
              },
              {
                  cwd:'test/module2/',
                  src:['**/*.js','**/*.css','**/*.htm','**/*.{jpg,jpeg,gif,png}'],
                  dest:'tmp/module2/'
              }
            ]
        }
      }
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  levin_assets_mapping: {
        options:{
          // default the mapping file name is mapping.json under to user set the dest directory
          mapping:'{{= dest}}md5conf.json',
          //  default value is md5
          algorithm:'md5'
        },
        asset:{
            files:[
            // generate mapping file by user set directory
              {
                  cwd:'test/module1/',
                  src:['**/*.js','**/*.css','**/*.htm','**/*.{jpg,jpeg,gif,png}'],
                  dest:'tmp/module1/'
              },
              {
                  cwd:'test/module2/',
                  src:['**/*.js','**/*.css','**/*.htm','**/*.{jpg,jpeg,gif,png}'],
                  dest:'tmp/module2/'
              }
            ]
        }
      }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
