import React from 'react';
import HomeAction from '../actions/HomeAction';
import HomeStore from '../stores/HomeStore';
import {Link} from 'react-router';
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = HomeStore.getState();
    this.onChange = this.onChange.bind(this);
  }
  
  componentDidMount() {
      HomeStore.listen(this.onChange);
      HomeAction.getImgs();
      $('#files').fileinput({
          showUpload: true,
          dropZoneEnabled: false,
          uploadUrl: '/api/upload',
          allowedFileExtensions: ['jpg', 'gif', 'png'],
          maxFileCount: 10,
          overwriteInitial: false,
          enctype: 'multipart/form-data',
          msgFilesTooMany: "too many imgs, only 1!"
      }).on('filesorted', function(e, params) {
        console.log('File sorted params', params);
    }).on('fileuploaded', function(e, params) {
        console.log('File uploaded params', params);
        HomeAction.getImgs();
    });
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.onChange);
  }
  
  onChange(state) {
    this.setState(state);
  }
  handleClick(e){
    var img = e.currentTarget;
    var num = parseInt(img.getAttribute('class').match(/\d/g).join());
    num==2?num=12:num=2;
    img.setAttribute('class','col-md-'+num)
  }
  render() {
    var imgs = this.state.data.map((i,index)=>{
      return (
      //.col-xs-*(<768px)
      //.col-sm-*(=768px)
      //.col-md-*(=992px)
        <div key={index} ref={'img'+index} className="col-md-2" onClick={this.handleClick}>
            <div className="thumbnail">
              <img src={'/imgs/'+i} />
            </div>
        </div>
      )
    })
    return (
      <div>
        <div>
          <input id="files" name="files" type="file" multiple className="file" data-preview-file-type="text" />
        </div>
        <div className="row">
          {imgs}
        </div>
      </div>
    );
  }
}

export default Home;
