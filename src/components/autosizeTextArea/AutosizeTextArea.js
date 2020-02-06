import React, { Component } from 'react';
import autosize from 'autosize';

class TextArea extends Component {
    componentDidMount(){
       this.textarea.focus();
       autosize(this.textarea);
    }
    render(){
      const style = {
                maxHeight:'9rem',
                minHeight:'4rem',
                  resize:'none',
                  padding:'.7rem',
                  boxSizing:'border-box',
                  fontSize:'1.6rem'};
        return (
            <textarea
                style={style} 
                ref={c=>this.textarea=c}
                placeholder={this.props.placeholder}
                rows={1} 
                value={this.props.value}
                onChange={(e) => this.props.onChange(e.target.value)}
                className={this.props.className}
            />
        );
    }
}

export default TextArea