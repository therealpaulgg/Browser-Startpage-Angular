export class SettingsInfo {
    tempSetting: string
    bothDegrees: boolean
    themeSetting: string
    
    constructor(tempSetting, bothDegrees, themeSetting) {
        this.tempSetting = tempSetting
        this.bothDegrees = bothDegrees
        this.themeSetting = themeSetting
    }
}