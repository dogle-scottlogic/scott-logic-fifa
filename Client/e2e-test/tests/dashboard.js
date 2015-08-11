describe('When a user opens the dashboard', function() {
  it('The title should be FIFA League', function(){
    browser.get('http://localhost:3000');
    expect(element(by.id('title')).getText()).toEqual('FIFA League');
  });
});
