import alt from '../alt';
import HomeAction from '../actions/HomeAction';

class HomeStore{
  constructor(){
    this.bindActions(HomeAction);
    this.data = [];
  }
  onUpdateData(arr){
    this.data = arr;
  }

  onSendDone(data){
    this.data = data;
    toastr.success("Successed");
    console.log(data);
  }
  onSendfail(data){
    console.log(data);
    toastr.success("Field");
  }
}  
export default alt.createStore(HomeStore);
