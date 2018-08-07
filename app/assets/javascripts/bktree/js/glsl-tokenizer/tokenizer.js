

function Tokenization()
{
  var literals100;
  var operators;
  var builtins100;
  var literals300es;
  var builtins300es;

  var NORMAL = 999          // <-- never emitted
    , TOKEN = 9999          // <-- never emitted
    , BLOCK_COMMENT = 0
    , LINE_COMMENT = 1
    , PREPROCESSOR = 2
    , OPERATOR = 3
    , INTEGER = 4
    , FLOAT = 5
    , IDENT = 6
    , BUILTIN = 7
    , KEYWORD = 8
    , WHITESPACE = 9
    , EOF = 10
    , HEX = 11

  var map = [
      'block-comment'
    , 'line-comment'
    , 'preprocessor'
    , 'operator'
    , 'integer'
    , 'float'
    , 'ident'
    , 'builtin'
    , 'keyword'
    , 'whitespace'
    , 'eof'
    , 'integer'
  ]


  literals300es = [
   'layout'
  , 'centroid'
  , 'smooth'
  , 'case'
  , 'mat2x2'
  , 'mat2x3'
  , 'mat2x4'
  , 'mat3x2'
  , 'mat3x3'
  , 'mat3x4'
  , 'mat4x2'
  , 'mat4x3'
  , 'mat4x4'
  , 'uint'
  , 'uvec2'
  , 'uvec3'
  , 'uvec4'
  , 'samplerCubeShadow'
  , 'sampler2DArray'
  , 'sampler2DArrayShadow'
  , 'isampler2D'
  , 'isampler3D'
  , 'isamplerCube'
  , 'isampler2DArray'
  , 'usampler2D'
  , 'usampler3D'
  , 'usamplerCube'
  , 'usampler2DArray'
  , 'coherent'
  , 'restrict'
  , 'readonly'
  , 'writeonly'
  , 'resource'
  , 'atomic_uint'
  , 'noperspective'
  , 'patch'
  , 'sample'
  , 'subroutine'
  , 'common'
  , 'partition'
  , 'active'
  , 'filter'
  , 'image1D'
  , 'image2D'
  , 'image3D'
  , 'imageCube'
  , 'iimage1D'
  , 'iimage2D'
  , 'iimage3D'
  , 'iimageCube'
  , 'uimage1D'
  , 'uimage2D'
  , 'uimage3D'
  , 'uimageCube'
  , 'image1DArray'
  , 'image2DArray'
  , 'iimage1DArray'
  , 'iimage2DArray'
  , 'uimage1DArray'
  , 'uimage2DArray'
  , 'image1DShadow'
  , 'image2DShadow'
  , 'image1DArrayShadow'
  , 'image2DArrayShadow'
  , 'imageBuffer'
  , 'iimageBuffer'
  , 'uimageBuffer'
  , 'sampler1DArray'
  , 'sampler1DArrayShadow'
  , 'isampler1D'
  , 'isampler1DArray'
  , 'usampler1D'
  , 'usampler1DArray'
  , 'isampler2DRect'
  , 'usampler2DRect'
  , 'samplerBuffer'
  , 'isamplerBuffer'
  , 'usamplerBuffer'
  , 'sampler2DMS'
  , 'isampler2DMS'
  , 'usampler2DMS'
  , 'sampler2DMSArray'
  , 'isampler2DMSArray'
  , 'usampler2DMSArray'
];

  literals100 = [
    // current
      'precision'
    , 'highp'
    , 'mediump'
    , 'lowp'
    , 'attribute'
    , 'const'
    , 'uniform'
    , 'varying'
    , 'break'
    , 'continue'
    , 'do'
    , 'for'
    , 'while'
    , 'if'
    , 'else'
    , 'in'
    , 'out'
    , 'inout'
    , 'float'
    , 'int'
    , 'void'
    , 'bool'
    , 'true'
    , 'false'
    , 'discard'
    , 'return'
    , 'mat2'
    , 'mat3'
    , 'mat4'
    , 'vec2'
    , 'vec3'
    , 'vec4'
    , 'ivec2'
    , 'ivec3'
    , 'ivec4'
    , 'bvec2'
    , 'bvec3'
    , 'bvec4'
    , 'sampler1D'
    , 'sampler2D'
    , 'sampler3D'
    , 'samplerCube'
    , 'sampler1DShadow'
    , 'sampler2DShadow'
    , 'struct'

    // future
    , 'asm'
    , 'class'
    , 'union'
    , 'enum'
    , 'typedef'
    , 'template'
    , 'this'
    , 'packed'
    , 'goto'
    , 'switch'
    , 'default'
    , 'inline'
    , 'noinline'
    , 'volatile'
    , 'public'
    , 'static'
    , 'extern'
    , 'external'
    , 'interface'
    , 'long'
    , 'short'
    , 'double'
    , 'half'
    , 'fixed'
    , 'unsigned'
    , 'input'
    , 'output'
    , 'hvec2'
    , 'hvec3'
    , 'hvec4'
    , 'dvec2'
    , 'dvec3'
    , 'dvec4'
    , 'fvec2'
    , 'fvec3'
    , 'fvec4'
    , 'sampler2DRect'
    , 'sampler3DRect'
    , 'sampler2DRectShadow'
    , 'sizeof'
    , 'cast'
    , 'namespace'
    , 'using'
  ];

  

    builtins100 = [
    // Keep this list sorted
    'abs'
    , 'acos'
    , 'all'
    , 'any'
    , 'asin'
    , 'atan'
    , 'ceil'
    , 'clamp'
    , 'cos'
    , 'cross'
    , 'dFdx'
    , 'dFdy'
    , 'degrees'
    , 'distance'
    , 'dot'
    , 'equal'
    , 'exp'
    , 'exp2'
    , 'faceforward'
    , 'floor'
    , 'fract'
    , 'gl_BackColor'
    , 'gl_BackLightModelProduct'
    , 'gl_BackLightProduct'
    , 'gl_BackMaterial'
    , 'gl_BackSecondaryColor'
    , 'gl_ClipPlane'
    , 'gl_ClipVertex'
    , 'gl_Color'
    , 'gl_DepthRange'
    , 'gl_DepthRangeParameters'
    , 'gl_EyePlaneQ'
    , 'gl_EyePlaneR'
    , 'gl_EyePlaneS'
    , 'gl_EyePlaneT'
    , 'gl_Fog'
    , 'gl_FogCoord'
    , 'gl_FogFragCoord'
    , 'gl_FogParameters'
    , 'gl_FragColor'
    , 'gl_FragCoord'
    , 'gl_FragData'
    , 'gl_FragDepth'
    , 'gl_FragDepthEXT'
    , 'gl_FrontColor'
    , 'gl_FrontFacing'
    , 'gl_FrontLightModelProduct'
    , 'gl_FrontLightProduct'
    , 'gl_FrontMaterial'
    , 'gl_FrontSecondaryColor'
    , 'gl_LightModel'
    , 'gl_LightModelParameters'
    , 'gl_LightModelProducts'
    , 'gl_LightProducts'
    , 'gl_LightSource'
    , 'gl_LightSourceParameters'
    , 'gl_MaterialParameters'
    , 'gl_MaxClipPlanes'
    , 'gl_MaxCombinedTextureImageUnits'
    , 'gl_MaxDrawBuffers'
    , 'gl_MaxFragmentUniformComponents'
    , 'gl_MaxLights'
    , 'gl_MaxTextureCoords'
    , 'gl_MaxTextureImageUnits'
    , 'gl_MaxTextureUnits'
    , 'gl_MaxVaryingFloats'
    , 'gl_MaxVertexAttribs'
    , 'gl_MaxVertexTextureImageUnits'
    , 'gl_MaxVertexUniformComponents'
    , 'gl_ModelViewMatrix'
    , 'gl_ModelViewMatrixInverse'
    , 'gl_ModelViewMatrixInverseTranspose'
    , 'gl_ModelViewMatrixTranspose'
    , 'gl_ModelViewProjectionMatrix'
    , 'gl_ModelViewProjectionMatrixInverse'
    , 'gl_ModelViewProjectionMatrixInverseTranspose'
    , 'gl_ModelViewProjectionMatrixTranspose'
    , 'gl_MultiTexCoord0'
    , 'gl_MultiTexCoord1'
    , 'gl_MultiTexCoord2'
    , 'gl_MultiTexCoord3'
    , 'gl_MultiTexCoord4'
    , 'gl_MultiTexCoord5'
    , 'gl_MultiTexCoord6'
    , 'gl_MultiTexCoord7'
    , 'gl_Normal'
    , 'gl_NormalMatrix'
    , 'gl_NormalScale'
    , 'gl_ObjectPlaneQ'
    , 'gl_ObjectPlaneR'
    , 'gl_ObjectPlaneS'
    , 'gl_ObjectPlaneT'
    , 'gl_Point'
    , 'gl_PointCoord'
    , 'gl_PointParameters'
    , 'gl_PointSize'
    , 'gl_Position'
    , 'gl_ProjectionMatrix'
    , 'gl_ProjectionMatrixInverse'
    , 'gl_ProjectionMatrixInverseTranspose'
    , 'gl_ProjectionMatrixTranspose'
    , 'gl_SecondaryColor'
    , 'gl_TexCoord'
    , 'gl_TextureEnvColor'
    , 'gl_TextureMatrix'
    , 'gl_TextureMatrixInverse'
    , 'gl_TextureMatrixInverseTranspose'
    , 'gl_TextureMatrixTranspose'
    , 'gl_Vertex'
    , 'greaterThan'
    , 'greaterThanEqual'
    , 'inversesqrt'
    , 'length'
    , 'lessThan'
    , 'lessThanEqual'
    , 'log'
    , 'log2'
    , 'matrixCompMult'
    , 'max'
    , 'min'
    , 'mix'
    , 'mod'
    , 'normalize'
    , 'not'
    , 'notEqual'
    , 'pow'
    , 'radians'
    , 'reflect'
    , 'refract'
    , 'sign'
    , 'sin'
    , 'smoothstep'
    , 'sqrt'
    , 'step'
    , 'tan'
    , 'texture2D'
    , 'texture2DLod'
    , 'texture2DProj'
    , 'texture2DProjLod'
    , 'textureCube'
    , 'textureCubeLod'
    , 'texture2DLodEXT'
    , 'texture2DProjLodEXT'
    , 'textureCubeLodEXT'
    , 'texture2DGradEXT'
    , 'texture2DProjGradEXT'
    , 'textureCubeGradEXT'
  ]; 
 
  builtins300es = [
    // the updated gl_ constants
      'gl_VertexID'
    , 'gl_InstanceID'
    , 'gl_Position'
    , 'gl_PointSize'
    , 'gl_FragCoord'
    , 'gl_FrontFacing'
    , 'gl_FragDepth'
    , 'gl_PointCoord'
    , 'gl_MaxVertexAttribs'
    , 'gl_MaxVertexUniformVectors'
    , 'gl_MaxVertexOutputVectors'
    , 'gl_MaxFragmentInputVectors'
    , 'gl_MaxVertexTextureImageUnits'
    , 'gl_MaxCombinedTextureImageUnits'
    , 'gl_MaxTextureImageUnits'
    , 'gl_MaxFragmentUniformVectors'
    , 'gl_MaxDrawBuffers'
    , 'gl_MinProgramTexelOffset'
    , 'gl_MaxProgramTexelOffset'
    , 'gl_DepthRangeParameters'
    , 'gl_DepthRange'

    // other builtins
    , 'trunc'
    , 'round'
    , 'roundEven'
    , 'isnan'
    , 'isinf'
    , 'floatBitsToInt'
    , 'floatBitsToUint'
    , 'intBitsToFloat'
    , 'uintBitsToFloat'
    , 'packSnorm2x16'
    , 'unpackSnorm2x16'
    , 'packUnorm2x16'
    , 'unpackUnorm2x16'
    , 'packHalf2x16'
    , 'unpackHalf2x16'
    , 'outerProduct'
    , 'transpose'
    , 'determinant'
    , 'inverse'
    , 'texture'
    , 'textureSize'
    , 'textureProj'
    , 'textureLod'
    , 'textureOffset'
    , 'texelFetch'
    , 'texelFetchOffset'
    , 'textureProjOffset'
    , 'textureLodOffset'
    , 'textureProjLod'
    , 'textureProjLodOffset'
    , 'textureGrad'
    , 'textureGradOffset'
    , 'textureProjGrad'
    , 'textureProjGradOffset'
  ]

operators = [
    '<<='
  , '>>='
  , '++'
  , '--'
  , '<<'
  , '>>'
  , '<='
  , '>='
  , '=='
  , '!='
  , '&&'
  , '||'
  , '+='
  , '-='
  , '*='
  , '/='
  , '%='
  , '&='
  , '^^'
  , '^='
  , '|='
  , '('
  , ')'
  , '['
  , ']'
  , '.'
  , '!'
  , '~'
  , '*'
  , '/'
  , '%'
  , '+'
  , '-'
  , '<'
  , '>'
  , '&'
  , '^'
  , '|'
  , '?'
  , ':'
  , '='
  , ','
  , ';'
  , '{'
  , '}'
];



  this.tokenize =  function (opt) {
    var i = 0
      , total = 0
      , mode = NORMAL
      , c
      , last
      , content = []
      , tokens = []
      , token_idx = 0
      , token_offs = 0
      , line = 1
      , col = 0
      , start = 0
      , isnum = false
      , isoperator = false
      , input = ''
      , len

    opt = opt || {}
    //console.log("opt : " + opt);
    var allBuiltins = builtins100
    var allLiterals = literals100
    if (opt.version === '300 es') 
    {
      allBuiltins = builtins300es
      allLiterals = literals300es
    }

    /*return function(data) {
      tokens = []
       console.log("return data");
      if (data !== null) 
      {
        var temp = write(data.replace ? data.replace(/\r\n/g, '\n') : data);
        console.log("data isn't NULL : " + temp.length);
        return temp;
      }
      else
      {
        console.log("data is NULL : " + tokens.length);
        return tokens;//end()
      }
    }*/

    function token(data) {
      if (data.length) {
        tokens.push({
          type: map[mode]
        , data: data
        , position: start
        , line: line
        , column: col
        })
      }
    }

    function write(chunk) {
      console.log("write in!!");
      i = 0
      input += chunk
      len = input.length

      var last


      while(c = input[i], i < len) {
        last = i
        //console.log(' mode : ' + mode + ' / c : ' + c + ' / last : ' + last);
        switch(mode) {
          case BLOCK_COMMENT: i = block_comment(); break
          case LINE_COMMENT: i = line_comment(); break
          case PREPROCESSOR: i = preprocessor(); break
          case OPERATOR: i = operator(); break
          case INTEGER: i = integer(); break
          case HEX: i = hex(); break
          case FLOAT: i = decimal(); break
          case TOKEN: i = readtoken(); break
          case WHITESPACE: i = whitespace(); break
          case NORMAL: i = normal(); break
        }

        if(last !== i) {
          switch(input[last]) {
            case '\n': col = 0; ++line; break
            default: ++col; break
          }
        }
      }

      total += i
      input = input.slice(i)
      return tokens;
    }


    //-------------------------------------------------------------------------;


    function end(chunk) {
      if(content.length) {
        token(content.join(''))
      }

      mode = EOF
      token('(eof)')
      return tokens
    }

    function normal() {
      content = content.length ? [] : content
      
      //console.log('last : ' + last + ' / c : ' + c);

      if(last === '/' && c === '*') {
        start = total + i - 1
        mode = BLOCK_COMMENT
        last = c
        //console.log('===========last : ' + last);
        return i + 1
      }

      if(last === '/' && c === '/') {
        start = total + i - 1
        mode = LINE_COMMENT
        last = c
        //console.log('===========last : ' + last);
        return i + 1
      }

      if(c === '#') {
        mode = PREPROCESSOR
        start = total + i
        return i
      }

      if(/\s/.test(c)) {
        mode = WHITESPACE
        start = total + i
        return i
      }

      isnum = /\d/.test(c)
      isoperator = /[^\w_]/.test(c)

      start = total + i
      mode = isnum ? INTEGER : isoperator ? OPERATOR : TOKEN
      return i
    }

    function whitespace() {
      if(/[^\s]/g.test(c)) {
        token(content.join(''))
        mode = NORMAL
        return i
      }
      content.push(c)
      last = c
      return i + 1
    }

    function preprocessor() {
      if((c === '\r' || c === '\n') && last !== '\\') {
        token(content.join(''))
        mode = NORMAL
        return i
      }
      content.push(c)
      last = c
      //console.log('===========last : ' + last);
      return i + 1
    }

    function line_comment() {
      return preprocessor()
    }

    function block_comment() {
      if(c === '/' && last === '*') {
        content.push(c)
        token(content.join(''))
        mode = NORMAL
        return i + 1
      }

      content.push(c)
      last = c
      //console.log('===========last : ' + last);
      return i + 1
    }

    function operator() {
      if(last === '.' && /\d/.test(c)) {
        mode = FLOAT
        return i
      }

      if(last === '/' && c === '*') {
        mode = BLOCK_COMMENT
        return i
      }

      if(last === '/' && c === '/') {
        mode = LINE_COMMENT
        return i
      }

      if(c === '.' && content.length) {
        while(determine_operator(content));
        //console.log('---------------FLOAT');
        mode = FLOAT
        return i
      }

      if(c === ';' || c === ')' || c === '(') {
        if(content.length) while(determine_operator(content));
        //console.log('---------------OPERATOR');
        token(c)
        mode = NORMAL
        return i + 1
      }

      var is_composite_operator = content.length === 2 && c !== '='
      if(/[\w_\d\s]/.test(c) || is_composite_operator) {
        while(determine_operator(content));
        //console.log('---------------composite OPERATOR');
        mode = NORMAL
        return i
      }

      content.push(c)
      last = c
      //console.log('===========last : ' + last);
      return i + 1
    }

    function determine_operator(buf) {
      var j = 0
        , idx
        , res

      do {
        //console.log('buf : ' + buf);
        idx = operators.indexOf(buf.slice(0, buf.length + j).join(''))
        res = operators[idx]

        if(idx === -1) {
          if(j-- + buf.length > 0) 
            continue
          res = buf.slice(0, 1).join('')
        }

        token(res)

        start += res.length
        content = content.slice(res.length)

        //console.log('idx : ' + idx + ' / res : ' + res  + ' / buf : ' + buf);
        return content.length
      } while(1)
    }

    function hex() {
      if(/[^a-fA-F0-9]/.test(c)) {
        token(content.join(''))
        mode = NORMAL
        return i
      }

      content.push(c)
      last = c
      //console.log('===========last : ' + last);
      return i + 1
    }

    function integer() {
      if(c === '.') {
        content.push(c)
        mode = FLOAT
        last = c
        return i + 1
      }

      if(/[eE]/.test(c)) {
        content.push(c)
        mode = FLOAT
        last = c
        return i + 1
      }

      if(c === 'x' && content.length === 1 && content[0] === '0') {
        mode = HEX
        content.push(c)
        last = c
        return i + 1
      }

      if(/[^\d]/.test(c)) {
        token(content.join(''))
        mode = NORMAL
        return i
      }

      content.push(c)
      last = c
      //console.log('===========last : ' + last);
      return i + 1
    }

    function decimal() {
      if(c === 'f') {
        content.push(c)
        last = c
        i += 1
      }

      if(/[eE]/.test(c)) {
        content.push(c)
        last = c
        return i + 1
      }

      if (c === '-' && /[eE]/.test(last)) {
        content.push(c)
        last = c
        return i + 1
      }

      if(/[^\d]/.test(c)) {
        token(content.join(''))
        mode = NORMAL
        return i
      }

      content.push(c)
      last = c
      //console.log('===========last : ' + last);
      return i + 1
    }

    function readtoken() {
      if(/[^\d\w_]/.test(c)) {
        var contentstr = content.join('')
        if(allLiterals.indexOf(contentstr) > -1) {
          mode = KEYWORD
        } else if(allBuiltins.indexOf(contentstr) > -1) {
          mode = BUILTIN
        } else {
          mode = IDENT
        }
        token(content.join(''))
        mode = NORMAL
        return i
      }
      content.push(c)
      last = c
      //console.log('===========last : ' + last);
      return i + 1
    }


    var temp = write(opt.replace ? opt.replace(/\r\n/g, '\n') : opt);
    console.log("data isn't NULL : " + temp.length);
    return temp;   
  
  }
}


