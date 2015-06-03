# JSXtyper

JSXTyper generates TypeScript interfaces from your .jsx files. By referencing the generated .ts file and using the generated *props* and *state* interfaces you can make sure all data expected by the .jsx is supplied, and catch any typos at build-time.

## How to build JSXTyper

Install Node if you haven't already. Then open Node.js command prompt and run:

    npm install

This will install esprima-fb, estraverse and estraverse-fb.

We also depend on estree.d.ts. This file will be automatically downloaded when you build the solution in Visual Studio, unless you have turned off automatic downloading of dependencies. To manually download this dependency open Package Manager Console and type:

    Install-Package estree.TypeScript.DefinitelyTyped

You are now ready to build. Open the .sln file in Visual Studio and select Build > Build Solution from the menu. Note that you must have [Node.js Tools for Visual Studio](https://www.visualstudio.com/features/node-js-vs) installed in order to open .njsproj projects.

## How to run JSXTyper

Open Node.js command prompt and run

    node jsxtyper.js example.jsx
    
## Grunt task

JSXTyper can also be invoked from Grunt. Here's a sample Gruntfile.js:

    module.exports = function(grunt) {

      grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jsxtyper: {
          'Generated/Views.ts': ['Views/*.jsx']
        }
      });

      grunt.loadNpmTasks('grunt-jsxtyper');

      grunt.registerTask('default', ['jsxtyper']);
    };
