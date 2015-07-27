// Verify the status of the promise before and after the flush
verifyPromiseAndFlush = function(currentController, httpBackend){
    // verifying the promise before the request
    expect(currentController.loadingPromise.$$state.status).toEqual(0);
    httpBackend.flush();
    // verifying the promise after the request
    expect(currentController.loadingPromise.$$state.status).toEqual(1);
}

// Verify the status of the promise before and after the promise
verifyPromiseAndDigest = function(currentController, defer, rootScope){
    // verifying the promise before the request
    expect(currentController.loadingPromise.$$state.status).toEqual(0);
    defer.resolve();
    rootScope.$digest();
    // verifying the promise after the request
    expect(currentController.loadingPromise.$$state.status).toEqual(1);
}
