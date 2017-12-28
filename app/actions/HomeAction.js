import alt from '../alt';

class HomeAction {
  constructor(){
    this.generateActions(
      'sendDone',
      'sendFail',
      'updateData'
    );
  }
  getImgs(){
     $.ajax({ 
      type:'GET',
      url: '/api/retrieveImgsName'
    })
      .done((data) => {
        this.actions.sendDone(data);
      })
      .fail((jqXhr) => {
        this.actions.sendFail(jqXhr)
      });
  }
}
export default alt.createActions(HomeAction);