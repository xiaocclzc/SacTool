import { Component } from "react";
import { getSkinVars,getSkins,setSkin,onSkinChanged } from "v3-react-skin";
import {withTranslation} from 'react-i18next';
import logo from "./img/logo.svg";
import "./css/Demo.css";
import {setLanguage,getLanguages} from "v3-react-i18n-utils";

interface state {
    skinVars: any,
    skinIndex: number,
    langIndex: number
}

/**
 * @class Demo
 * @description
 */
class Demo extends Component<any, state>{

    constructor(pros: Object) {
        super(pros);
        this.state = {
            skinVars: getSkinVars(),
            skinIndex:0,
            langIndex:0
        };
        //监听皮肤切换
        onSkinChanged((vars) => {
            this.setState({
                skinVars: vars
            });
        });
    }

    render() {
        const {t} = this.props;
        return (
            <div className="demo">
                <header className="header" style={{
                    backgroundColor: this.state.skinVars.vPrimaryColor
                }}>
                    <button onClick={this.changeSkin}>{t("changeTheme")}</button>
                    <button onClick={this.changeLang}>{t("changeLang")}</button>
                </header>
                <div className="content" style={{
                    color: this.state.skinVars.vPrimaryColor
                }}>
                    <img src={logo} className="logo" alt="logo" />
                    <h1>{t("welcome")}</h1>
                    <h6>{t("desc")}</h6>
                    <p>
                        {t("edit")}
                        <code>src/components/Demo/Index.tsx</code>
                        {t("tips")}
                    </p>
                    <a
                        className="link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t("startLearn")}
                    </a>
                </div>
            </div>
        );
    }

    changeSkin = ()=>{
        let index = this.state.skinIndex + 1;
        let skins = getSkins();
        index = index<skins.length ? index:0;
        let skin = skins[index];
        setSkin(skin.code);
        this.setState({
            skinIndex:index
        });
    }

    changeLang= ()=>{
        let promise = getLanguages();
        promise.then((langs)=>{
            let index = this.state.langIndex + 1;
            index = index<langs.length ? index:0;
            let lang = langs[index];
            setLanguage(lang.code);
            this.setState({
                langIndex:index
            })
        });
    }

    static propTypes = {
        
    };

}

export default withTranslation()(Demo);