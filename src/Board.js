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
      var that = this;
      var row = this.get(majorDiagonalIndex);
      console.log('starting to look at row '+majorDiagonalIndex);
      console.log(row);
      var n = Object.keys(this.attributes).length-1;
      var result = false;
      var lookRight = function(row,column) {
        row++;
        column++;
        console.log('looking at '+row+','+column);
        var nextRow = that.get(row);
        console.log(nextRow[column]);
        //debugger;
        if (nextRow[column]) {
          console.log('found another 1!');
          result = true;
          column = n;
        } else if (column < n-1 && row < n-1) {
          lookRight(row, column);
        }
      };
      for (var i = 0; i < row.length; i++) {
        if (row[i]) {
          console.log('1 detected at column '+i);
          if (i < n-1 && majorDiagonalIndex < n-1)
            lookRight(majorDiagonalIndex,i);
        }
      }
      console.log('returning '+result);
      return result;
    },

    hasAnyMajorDiagonalConflicts: function(){
      var result = false;
      var n = Object.keys(this.attributes).length-1;
      for(var i = 0; i < n; i++) {
        result = result || this.hasMajorDiagonalConflictAt(i);
      }
      console.log('final result: '+result);
      console.log('end of hasAnyMajorDiagonalConflicts');
      return result;
    },

    hasMinorDiagonalConflictAt: function(minorDiagonalIndex){
      var n = Object.keys(this.attributes).length-1;
      var diagonal = [];
      var x = Math.max(0, minorDiagonalIndex - n + 2);
      var y = Math.min(n-1, 1 + minorDiagonalIndex);
      while (Math.max(x,y) < n && Math.min(x,y) >= 0) {
        diagonal.push(this.get(x)[y]);
        x++;
        y--;
      }
      var result = _.reduce(diagonal, function(sum, value){
        return sum + value;
      }, 0);
      return result > 1 ? true : false;
    },

    hasAnyMinorDiagonalConflicts: function(){
      var result = false;
      var n = Object.keys(this.attributes).length-1;
      for(var i = 0; i < (2*n-3); i++) {
        result = result || this.hasMinorDiagonalConflictAt(i);
      }
      return result;
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
