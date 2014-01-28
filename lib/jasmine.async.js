this.AsyncSpec = (function(global){

  // Private Methods
  // ---------------
  
  function runAsync(block, timeout, ctx){
    return function(){
      var done = false;
      var complete = function(){ done = true; };

      runs(function(){
        try{
          block.call(this,complete);
        } catch ( error ){
          complete.call(this);
          throw error;
        }
      });

      waitsFor(function(){
        return done;
      }, null, timeout);
    };
  }

  // Constructor Function
  // --------------------

  function AsyncSpec(spec, timeout){
    this.spec = spec;
    this.timeout = timeout?timeout:5000;
  }

  // Public API
  // ----------

  AsyncSpec.prototype.beforeEach = function(block, timeout){
    this.spec.beforeEach(runAsync(block, timeout?timeout:this.timeout, this));
  };

  AsyncSpec.prototype.afterEach = function(block,timeout){
    this.spec.afterEach(runAsync(block,timeout?timeout:this.timeout,this));
  };

  AsyncSpec.prototype.it = function(description, block, timeout){
    // For some reason, `it` is not attached to the current
    // test suite, so it has to be called from the global
    // context.
    global.it(description, runAsync(block, timeout?timeout:this.timeout,this));
  };

  return AsyncSpec;
})(this);
