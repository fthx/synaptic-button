/*	Synaptic button
	GNOME Shell extension
	(c) Francois Thirioux 2020
	License: GPLv3 */
	

const { Clutter, Gio, GLib, GObject, Shell, St } = imports.gi;
const Main = imports.ui.main;
const Util = imports.misc.util;
const PanelMenu = imports.ui.panelMenu;
const Lang = imports.lang;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


var SynapticIndicator = GObject.registerClass(
class SynapticIndicator extends PanelMenu.Button {
	_init() {
		super._init(0.0, 'Synaptic Button');
		
		// define local package manager symbolic icon					
		this.iconPath = Me.path + "/package-manager-symbolic.svg";
		this.synapticIcon = Gio.icon_new_for_string(this.iconPath);
		
		// create icon
        this.hbox = new St.BoxLayout({style_class: 'panel-button', visible: true, reactive: true, can_focus: true, track_hover: true}); 
		this.icon = new St.Icon({ gicon: this.synapticIcon, style_class: 'system-status-icon' });
        this.hbox.add_child(this.icon);
        this.add_child(this.hbox);
        
        // connect signal
        this.click = this.connect('button-press-event', Lang.bind(this, this._runSynaptic))
	}
	
	_runSynaptic() {
		try {
			Util.trySpawnCommandLine("synaptic-pkexec")
		} catch(err) {
			Main.notify("Error: unable to run Synaptic")
		}
	}
	
	destroy() {
		this.disconnect(this.click);
		super.destroy()
	}
})

function init() {
}

var _indicator;

function enable() {
    _indicator = new SynapticIndicator();
    Main.panel.addToStatusArea('synaptic-indicator', _indicator)
}

function disable() {
    _indicator.destroy()
}
