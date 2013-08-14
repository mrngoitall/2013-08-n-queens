(function(){

  window.Board = Backbone.Model.extend({

    initialize: function(params){
      if (params.n) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function(){
      return _(_.range(this.get('n'))).map(function(rowIndex){
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex){
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex){
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex){
      return colIndex + rowIndex;
    },


    hasAnyRooksConflicts: function(){
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex){
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function(){
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex){
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    // todo: fill in all these functions - they'll help you!

    hasRowConflictAt: function(rowIndex){
      var row = this.get(rowIndex);
      var result = _.reduce(row, function(sum, value){
        return sum + value;
      }, 0);
      return result > 1 ? true : false;
    },

    hasAnyRowConflicts: function(){
      var that = this;
      var result = false;
      _.each(this.attributes, function(value, key){
        result = result || that.hasRowConflictAt(key);
      });
      return result;
    },

    hasColConflictAt: function(colIndex){
      var col = [];
      for(var i = 0; i < Object.keys(this.attributes).length - 1; i++){
        col.push(this.get(i)[colIndex]);
      }
      var result = _.reduce(col, function(sum, value){
        return sum + value;
      }, 0);
      return result > 1 ? true : false;
    },

    hasAnyColConflicts: function(){
      var that = this;
      var result = false;
      _.each(this.attributes, function(value, key){
        result = result || that.hasColConflictAt(key);
      });
      return result;
    },

    hasMajorDiagonalConflictAt: function(majorDiagonalIndex){
      // i = number of arrays to return
      var n = Object.keys(this.attributes).length-1;
      var startX = 0;
      var startY = n-2;
      var diagonal = [];
      x = Math.max(startX, majorDiagonalIndex-startY);
      y = Math.max(startY-majorDiagonalIndex,0);
      while (Math.max(x,y) < n) {
        diagonal.push(this.get(x)[y]);
        x++;
        y++;
      }
      var result = _.reduce(diagonal, function(sum, value){
        return sum + value;
      }, 0);
      return result > 1 ? true : false;
    },

    hasAnyMajorDiagonalConflicts: function(){
      var result = false;
      var n = Object.keys(this.attributes).length-1;
      for(var i = 0; i < (2*n-3); i++) {
        result = result || this.hasMajorDiagonalConflictAt(i);
      }
      return result; // fixme
    },

    hasMinorDiagonalConflictAt: function(minorDiagonalIndex){
      // var startX = 
      // return false; // fixme
    },

    hasAnyMinorDiagonalConflicts: function(){
      return false; // fixme
    }

  });

  var makeEmptyMatrix = function(n){
    return _(_.range(n)).map(function(){
      return _(_.range(n)).map(function(){
        return 0;
      });
    });
  };

}());
