/**
 * 红包详情
 **/

'use strict';

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList, Alert, NativeModules,
} from 'react-native';

export default class RedPackMyReceive extends Component{

    constructor(props) {
        super(props);
        let date = new Date();
        this.page = 1;
        this.pagesize = 10;
        this.state = {
            year:date.getFullYear(),
            headerUri:"",
            total_credit:'',
            count : 0,
            redPackList:[],
        };
    }

    componentDidMount() {

        NativeModules.QimRNBModule.redEnvelopeReceive(this.page,this.pagesize,this.state.year,function (response) {
            if (response.ok) {
                this.setState({
                    headerUri:response.user_img,
                    count:response.count,
                    total_credit:response.total_credit,
                    redPackList:response.redPackList,
                });
            } else {
                Alert.alert("提示", "获取数据失败");
            }
        }.bind(this));
    }


    componentWillUnmount() {
    }

    showRedPackType(item){
        if("lucky" == item.Type){
            return <Text style={styles.type}>拼</Text>;
        }
    }

    _renderItem = ({item,index}) => {
        return <View style={{flex:1,flexDirection:'row'}}>
            <Image style={styles.itemHeader} source={{uri: item.HeaderUri}}/>
            <View style={{marginLeft:15,justifyContent:'center',alignItems:'flex-start'}}>
                <View style={{flexDirection:'row'}}>
                    <Text style={{fontSize:16,color:'#333333'}}>{item.Name}</Text>
                    {this.showRedPackType(item)}
                </View>
                <Text style={{fontSize:13,color:'#999999',marginTop:10}}>{item.Time}</Text>
            </View>
            <View style={{flex:1,marginRight:15,justifyContent:'center',alignItems:'flex-end'}}>
                <Text style={{fontSize:16,color:'#333333'}}>{item.Credit}元</Text>
            </View>
        </View>

    };

    _footer = () => {
        return <View></View>;
    }

    _separator = () => {
        return <View style={{height:0.5,backgroundColor:'#ccc'}}/>;
    }

    render(){
        return (
            <View style={styles.wrapper}>
                <Image source={{uri: this.state.headerUri}} style={styles.sendPackHeader}/>
                <View style={{flexDirection:'row',marginTop:10}}>
                    <Text style={{fontSize:15,color:'#999999'}}>共收到</Text>
                    <Text style={{fontSize:15,color:'#E1604C'}}>{this.state.count}</Text>
                    <Text style={{fontSize:15,color:'#999999'}}>个红包</Text>
                </View>
                <Text style={{fontSize:50,color:'#E1604C',alignItems:'center',marginTop:20}}>{this.state.total_credit}</Text>

                <View style={styles.packListInfo}>
                    <FlatList
                        ref={(ref)=>this._flatList = ref}
                        ListFooterComponent={this._footer}
                        ItemSeparatorComponent={this._separator}
                        renderItem={this._renderItem}
                        refreshing={false}
                        data={this.state.redPackList}>
                    </FlatList>
                </View>
            </View>
        );
    }


}

var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection:'column',//默认垂直
        backgroundColor:'#FCF9ED',
        alignItems:'center',
    },
    packListInfo: {
        flex:1,
        flexDirection:'row',
        backgroundColor:'#FFFFFF'
    },
    sendPackHeader:{
        width: 60,
        height: 60,
        marginTop:30,
        alignItems: "center",//次轴方向水平
        borderRadius:30,
    },
    itemHeader: {
        width: 40,
        height: 40,
        borderRadius:20,
        marginLeft:10,
        marginTop:10,
        marginBottom:10,
        alignItems: "center",//次轴方向水平
    },
    type:{
        fontSize:10,
        color:'#ffffff',
        padding:3,
        backgroundColor:'#EF9035',
        marginLeft:5,
        borderRadius: 3,
    }

});