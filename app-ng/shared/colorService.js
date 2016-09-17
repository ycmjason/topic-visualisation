angular.module('LDAApp').
  // Topic service
  service('colorService', [function(){
    var self = this;

    this.isColor = function(c){
      try{
        if(self.getEncoding(c)){
          return true;
        }
      }catch(e){
        return false;
      }
    };

    this.invert = function(c, output_encoding){
      if(!self.isColor(c)){
        console.warn('c is not a color');
        return '';
      }
      output_encoding = output_encoding || 'hex';
      rgb = self.parseRGB(self.encode(c, 'rgb'));
      inverted_rgb = rgb.map(function(v){
        return 255-v;
      });
      return self.encode(self.rgbToString(inverted_rgb), output_encoding);
    };

    this.contrast = function(c, output_encoding){
      // ref: http://stackoverflow.com/questions/1855884/determine-font-color-based-on-background-color
      if(!self.isColor(c)){
        console.warn('c is not a color');
        return '';
      }
      output_encoding = output_encoding || 'hex';

      rgb = self.parseRGB(self.encode(c, 'rgb'));
      
      // perceptive luminance
      l = 1 - ( 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2])/255;

      return self.encode(l<0.5? '#000000': '#FFFFFF', output_encoding)
    }

    this.getSpectrum = function(n, colors, output_encoding){
      output_encoding = output_encoding || 'hex';
      function splitNumber(n, m_parts){
        var arr = [];
        var eachPart = Math.ceil(n / m_parts);
        for(var i = 0; i < m_parts; i++){
          arr.push(eachPart);
        }
        var diff = (eachPart * m_parts) - n;
        for(var i = 0; i < diff; i++){
          arr[i%arr.length]--;
        }
        return arr.reverse();
      }
      function _getSpectrum(n, from, to){
        // calculate the step for r/g/b.
        var step = [];
        for(var i = 0; i <= 2; i++){
          step[i] = (to[i]-from[i])/(n-1 || 1);
        }
        
        // generate n colors, i.e. a spectrum
        var spectrum = [];

        for(var i = 0; i < n; i++){
          var color = [];
          for(var j = 0; j <= 2; j++){
            color[j] = Math.round(from[j] + step[j] * i);
          }
          spectrum.push(self.encode(self.rgbToString(color), output_encoding));
        }
        
        return spectrum;
      }
      colors = colors.map(function(color){
        return self.parseRGB(self.encode(color, 'rgb'));
      });

      var spectrum = [];
      var ms = splitNumber(n, colors.length - 1);
      for(var i = 0; i < colors.length - 1; i++){
        spectrum.push(_getSpectrum(i==0?ms[i]:ms[i]+1, colors[i], colors[i+1]));
      }

      if(spectrum.length == 0) return [];
      return spectrum.reduce(function(s1, s2){
        return s1.concat(s2.slice(1)); 
      });
    }

    this.getEncoding = function(c){
      rgbRegex = /\brgb\(.+?,.+?,.+?\)/;
      hexRegex = /\b#?[a-fA-f0-9]{6}\b/;
      if(c.match(rgbRegex)){
        return 'rgb';
      }else if(c.match(hexRegex)){
        return 'hex';
      }else{
        throw new Error('Failed to match encoding');
      }
    };

    this.encode = function(c, type){
      switch(type){
        case 'rgb':
          if(self.getEncoding(c) == 'rgb') return c;
          return self.hexToRGB(c);
          break;
        case 'hex':
          if(self.getEncoding(c) == 'hex') return c;
          return self.rgbToHex(c);
          break;
        default:
          throw new Error('unknown type');
      }
    };


    this.rgbToString = function(rgb){
      return 'rgb(' + rgb.join(',') + ')';
    };

    this.parseRGB = function(c){
      return c.match(/rgb\((.+?),(.+?),(.+?)\)/).slice(1).map(function(v){
        return parseInt(v);
      });
    };

    this.rgbToHex = function(rgb){
      rgb = self.parseRGB(rgb);
      var componentToHex = function(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
      }
      return "#" + rgb.map(componentToHex).join('');
    };

    this.hexToRGB = function(h){
      var hexToDec = function(h){
        return parseInt(h, 16);
      };
      h = (h.charAt(0) == "#") ? h.substring(1, 7): h;
      rgbHex = [h.substring(0, 2), h.substring(2, 4), h.substring(4, 6)];
      return self.rgbToString(rgbHex.map(hexToDec)); 
    };

  }]);
