/*
 * grunt-levin-assets-mapping
 * 
 *
 * Copyright (c) 2015 levin cao
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var crypto = require('crypto');
  var path = require('path');
  var fs = require('fs');
  var defaultOutput = '{{= dest}}/mapping.json';


  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('levin_assets_mapping', 'Generate the pkg of zip by dest static assets', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      mapping: defaultOutput,
      encoding: 'utf8',
      algorithm: 'md5',       // the algorithm to create the hash
      hashlen: 0            // length for hashsum digest
    });

    var encoding = options.encoding;
    // add a custom template
    grunt.template.addDelimiters('{{ }}', '{{', '}}');
    var templateOptions = {
      delimiters: '{{ }}'
    };
    var done = this.async();
    var compNum = 0;
    var that = this;
    // Iterate over all specified file groups.
    this.files.forEach(function(filePair) {
      var cwd = filePair.cwd,
          dest = filePair.dest,
          dependencies = filePair.dependencies,
          mapping = {};

      // Concat specified files.
      var src = filePair.src.filter(function(filePath) {
        filePath = getRealPath(filePath);
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filePath)) {
          grunt.log.warn('Source file "' + filePath + '" not found.');
          return false;
        } else {
          return true;
        }
      });
      if (src.length === 0) {
        if (filePair.src.length < 1) {
          grunt.log.warn('No source file..');
          done();
          return;
        }
      }

      if (dest && grunt.file.isFile(dest)) {
        grunt.fail.fatal('Destination for target %s is not a directory', dest);
      }
      if(dependencies){
        if(grunt.util.kindOf(dependencies) == 'string'){
          if (options.mapping) {
            mapping[ 'dependencies' ] = dependencies
          }
        }
        if(grunt.util.kindOf(dependencies) == 'array' && dependencies.length){
          if (options.mapping) {
            mapping[ 'dependencies' ] = dependencies
          }
        }
      }
      src.forEach(function (filePath) {
        var realPath = getRealPath(filePath),
            hashed;


          var stream = fs.ReadStream(realPath);
          var shasum = crypto.createHash(options.algorithm);

          stream.on('data', function (data) {
            if(encoding){
              data = data.toString(encoding);
            }
            shasum.update(data);
          });

          stream.on('end', function () {
            hashed = shasum.digest('hex');
            hashed = !options.hashlen ? hashed : hashed.slice(0,options.hashlen);
            flush(filePath, hashed);
          });

      });
      //tar(src,dest,done);

      // get the file's real path
      function getRealPath(filePath) {
        return cwd ? path.join(cwd, filePath) : filePath;
      }


      function flush(filePath, hashed) {
        grunt.verbose.writeln('Hash'+ ' for ' + filePath + ': ' + hashed);
        if (options.mapping) {
          mapping[ filePath ] = {
            'md5' : hashed,
            'Content-Type':getContentType(filePath),
            'charset':'utf-8'
          };
        }
        //grunt.log.warn('levin-> '.green + Object.keys(mapping).length + ' => '.magenta + src.length);
        var len  = mapping.dependencies ? Object.keys(mapping).length - 1 : Object.keys(mapping).length;
        if (len === src.length) {
          createMapping();
        }
      }

      function getContentType(filePath){
        if(!filePath){
          return '';
        }
        if(/\.+css$/.test(filePath)){
            return 'text/css';
        }
        if(/\.+js$/.test(filePath)){
            return 'application/x-javascript';
        }
        if(/\.+(htm|html)$/.test(filePath)){
            return 'text/html';
        }
        if(/\.+(jpg|jpeg)$/.test(filePath)){
          return 'image/jpeg';
        }
        if(/\.+png$/.test(filePath)){
          return 'image/png';
        }
        if(/\.+gif$/.test(filePath)){
          return 'image/gif';
        }
        if(/\.+ico$/.test(filePath)){
          return 'image/x-icon';
        }
      }



      function createMapping() {
        if (options.mapping) {
          grunt.log.writeln('  All hashed. Generating mapping file.'.grey);

          templateOptions['data'] = {
            cwd: cwd || '',
            dest: dest
          };

          var jsonFile = 'string' === typeof options.mapping ? options.mapping : defaultOutput;
          jsonFile = grunt.template.process(jsonFile, templateOptions);
          //mapping = sortObject(mapping);
          grunt.file.write(jsonFile, JSON.stringify(mapping, null, 2));
          grunt.log.writeln('✔ '.green + 'Mapping file: ' + jsonFile + ' saved.');
        } else {
          grunt.log.writeln('  All hashed.'.grey);
        }
        compNum ++;
        if(compNum == that.files.length){
          done();
        }
      }

      function sortObject(obj) {
        var arr = [],
            sortedObject = {};

        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            arr.push(key);
          }
        }

        arr.sort();

        for (var i = 0, l = arr.length; i < l; i++) {
          sortedObject[arr[i]] = obj[arr[i]];
        }

        return sortedObject;
      }
    });
  });

};
