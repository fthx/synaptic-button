/*	Synaptic button
	GNOME Shell extension
	(c) Francois Thirioux 2020
	License: GPLv3 */
	

const { Clutter, GLib, GObject, Shell, St } = imports.gi;
const Main = imports.ui.main;
const Util = imports.misc.util;
const PanelMenu = imports.ui.panelMenu;
const Lang = imports.lang;


var SynapticIndicator = GObject.registerClass(
class SynapticIndicator extends PanelMenu.Button {
	_init() {
		super._init(0.0, 'Synaptic Button');
		
		// create icon
        this.hbox = new St.BoxLayout({style_class: 'panel-button', visible: true, reactive: true, can_focus: true, track_hover: true}); 
		this.icon = new St.Icon({ icon_name: 'system-software-install-symbolic', style_class: 'system-status-icon' });
        this.hbox.add_child(this.icon);
        this.add_child(this.hbox);
        
        // connect signal
        this.connect('button-press-event', Lang.bind(this, this._runSynaptic));
	}
	
	_runSynaptic() {
		try {
			Util.trySpawnCommandLine("synaptic-pkexec");
		} catch(err) {
			Main.notify("Error: unable to run Synaptic");
		}
	}
})

function init() {
}

var _indicator;

function enable() {
    _indicator = new SynapticIndicator();
    Main.panel.addToStatusArea('synaptic-indicator', _indicator);
}

function disable() {
    _indicator.destroy();
}
